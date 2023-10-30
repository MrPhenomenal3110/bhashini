const button = document.getElementById("translate");

button.addEventListener("click",()=>{
    const sourceLanguages = document.getElementById("translate-from");
    var sourceLanguage = sourceLanguages.value;

    const targetLanguages = document.getElementById("translate-to");
    const targetLanguage = targetLanguages.value;

    let previewArea = document.getElementById("main-preview-area");

    
    // var previewArea = document.querySelector(".preview-area");
    const textArea = document.getElementById("main-text-area");

    const apiKey = '58e362d3f7-f602-4ae6-bb29-5c72883f9a54';
    const userID = 'a10ff891057547ba81fc48713426d89b';
    const apiUrl = 'https://meity-auth.ulcacontrib.org/ulca/apis/v0/model/getModelsPipeline';

    async function fetchData() {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    "ulcaApiKey" : apiKey,
                    "userID" : userID,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                {
                    "pipelineTasks" : [
                        {
                            "taskType": "translation",
                            "config": {
                                "language": {
                                    "sourceLanguage": sourceLanguage,
                                    "targetLanguage": targetLanguage
                                }
                            }
                        }
                    ],
                    "pipelineRequestConfig" : {
                        "pipelineId" : "64392f96daac500b55c543cd"
                    }
                }
                )
            });

            const data = await response.json();
            // console.log(JSON.stringify(data));
            // console.log(data.pipelineResponseConfig[0].config[0].serviceId);

            const callbackURL = data.pipelineInferenceAPIEndPoint.callbackUrl
            const inferenceApiKey = data.pipelineInferenceAPIEndPoint.inferenceApiKey.value;

            // console.log(callbackURL);

            async function translate(){
                try {
                    const resp = await fetch(callbackURL, {
                        method: 'POST',
                        headers: {
                            "Authorization" : inferenceApiKey,
                            "Content-type" : "application/json"
                        },
                        body: JSON.stringify(
                        {
                            "pipelineTasks": [
                                {
                                    "taskType": "translation",
                                    "config": {
                                        "language": {
                                            "sourceLanguage": sourceLanguage,
                                            "targetLanguage": targetLanguage
                                        },
                                        "serviceId": "ai4bharat/indictrans-v2-all-gpu--t4"
                                    }
                                }
                            ],
                            "inputData": {
                                "input": [
                                    {
                                        "source": textArea.value
                                    }
                                ]
                            }
                        }
                        )
                    });
                    const translation = await resp.json();
                    console.log(JSON.stringify(translation));
                    // console.log(translation);
                    previewArea.innerHTML = translation.pipelineResponse[0].output[0].target;
                    console.log(translation.pipelineResponse[0].output[0].source);
                    console.log(translation.pipelineResponse[0].output[0].target);
                    
            }
            catch(error){
                console.error('Error:', error);
            }
        }
        translate();
        
    }
    catch (error) {
            console.error('Error:', error);
        }
    }

    // Call the async function
    fetchData();
});

