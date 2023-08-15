import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth-service.service';
import { ChatCompletionResponseMessage, Configuration, OpenAIApi } from 'openai';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class OpenAIService {

    constructor(private http: HttpClient, private authenticationService: AuthService) { }

    configuration = new Configuration({
        apiKey: environment.OPENAI_API_KEY,
    });
    openai = new OpenAIApi(this.configuration);


    chat(query: string): Observable<ChatCompletionResponseMessage> {

        this.openai.createFineTune
        var chatCompletion =
            this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [
                    // {
                    //     "role": "system",
                    //     "content": "You will be provided with page name, and your task is to generate html with css website page"
                    // },
                    { role: "user", content: query }
                ],
            }).then
                (chatCompletion => {
                    console.log(chatCompletion);
                    return chatCompletion.data.choices[0].message;
                });

        console.log("point 1");
        console.log(chatCompletion);
        //console.log(chatCompletion.data.choices[0].message);

        //return chatCompletion;
        return null;
    }

}