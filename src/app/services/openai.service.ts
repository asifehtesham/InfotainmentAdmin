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



    getTextContent(query: string,temperature: number, token: number) {

        return new Promise((resolve, reject) => {
            this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                temperature: temperature/100,
                max_tokens: token,
                messages: [
                    {
                        "role": "system",
                        "content": "You are a text provider."
                    },
                    {
                        "role": "user",
                        "content": `${query}`
                    }
                ],
            }).then
                (chatCompletion => {
                    resolve(chatCompletion.data.choices[0]);
                }).catch(err => {
                    reject(err);
                });
        })

    }





    getWebPage(query: string,temperature: number, token: number) {
 
        return new Promise((resolve, reject) => {
            this.openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                temperature: temperature/100,
                max_tokens: token,
                messages: [
                    {
                        "role": "system",
                        "content": "You are a website page builder."
                    },
                    {
                        "role": "system",
                        "content": "You are a website page builder."
                    },
                    {
                        "role": "system",
                        "content": "page without external css or javascript."
                    },
                    {
                        "role": "user",
                        "content": `give me a responsive modern stunning website page for ${query} in one page`
                    },
                    {
                        "role": "user",
                        "content": `${query}`
                    }
                ],
            }).then
                (chatCompletion => {
                    resolve(chatCompletion.data.choices[0]);
                }).catch(err => {
                    reject(err);
                });
        })

    }


    getImage(query: string, size,temperature: Number, token: Number) {

        return new Promise((res, rej) => {
            this.openai.createFineTune
            var chatCompletion =
                this.openai.createImage({
                    "prompt": query,
                    "n": 1,
                    "size": size
                }).then
                    (chatCompletion => {
                        res(chatCompletion);
                    }).catch(err => {
                        rej(err);
                    });
        });
    }




}