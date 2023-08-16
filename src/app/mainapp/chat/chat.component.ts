import { ChangeDetectorRef, Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ChatMessage, MemberChat } from 'src/app/models/chat/MemberChat';
import { OpenAIService } from "src/app/services/openai.service";

import { Options } from '@angular-slider/ngx-slider';
import { DateTime } from 'luxon';





@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef,
    private openAIService: OpenAIService) { }
  peoples: Array<MemberChat> = [];
  messages: Array<ChatMessage> = [];
  isApiResponse: boolean = true;

  // ///////////
  HtmlRes = false;
  ImageRes = false;
  TextRes = false;
  appendInFullPage = false;
  appendInSelectedArea = false;



  ///Text
  spelling = false;
  rephrase = false;
  ///
  disabled = false;
  responseFormat = 'HTML';
  isHTML = true;
  isImage = false;
  isText = false;
  isComponent = false;
  

  responsePlace = 'Full Screen';
  imageSize = '256x256';
  currentContent = null;

  temperature: number = 50;
  temperatureRange: Options = {
    floor: 0,
    ceil: 100
  };

  token: number = 4000;
  tokenRange: Options = {
    floor: 0,
    ceil: 4097
  };



  @Output() sendRes: EventEmitter<any> = new EventEmitter();

  @Input() type: String;
  @Input() typeValue: String;

  height: number = window.innerHeight - 70;
  ngOnInit(): void {

    this.type

console.log("last this.type .. ",this.type);


    console.log("this.responseFormat",this.responseFormat);


    if (this.type == "text") {
      this.responseFormat = "Text";
      this.isText = true;
      this.isHTML = false;
      this.isImage = false;
      this.isComponent = false;

      

    } else if (this.type == "image") {
      this.responseFormat = "Image";
      this.isImage = true;
      this.isText = false;
      this.isHTML = false;
      this.isComponent = false;

    } else if(this.type == "component"){
      this.responseFormat = "Text";
      this.isComponent = true;
      this.isImage = false;
      this.isText = false;
      this.isHTML = false;

    }else{
      this.responseFormat = "HTML";
      this.isHTML = true;
      this.isImage = false;
      this.isText = false;
      this.isComponent = false;
    }

    this.addMessage({
      own: false,
      message: "Hey, as an AI assistant, how may I help you?",
      time: new Date()

    });

    // this.addMessage({
    //   own: false,
    //   message: "Are we meeting today? Project has been already finished and I have results to show you.",
    //   time: new Date()
    // });

    // this.addMessage({
    //   own: false,
    //   message: "Well I am not sure. The rest of the team is not here yet. Maybe in an hour or so? Have you faced any problems at the last phase of the project?",
    //   time: new Date()
    // });

    // this.addMessage({
    //   own: true,
    //   message: "Actually everything was fine. I'm very excited to show this to our team.",
    //   time: new Date()
    // });

  }

  addMessage(message: ChatMessage) {
    this.messages = [...this.messages, message];
    this.cdr.detectChanges();
  }

  async sendMessage(inputValue, d) {

    if (!this.isApiResponse) {
      return false;
    }

    let inputText = inputValue.value;
    if (d) {
      inputText = inputValue.value;
      inputValue.value = "";
    } else {
      inputText = inputValue;
    }

    this.addMessage({
      own: true,
      message: inputText,
      time: new Date()
    });


    this.isApiResponse = false;

    if (this.responseFormat == "HTML") {

      await this.openAIService.getWebPage(inputText, this.temperature, this.token).then(result => {

        let text = result['message'].content


        var myArray;
        if (text.search("```") != -1) {
          myArray = text.split("```");
        } else {
          myArray = text.split('</html>');
        }

        console.log("myArray", myArray);


        let textWithoutTags = '';
        let htmlContent = null;


        if (myArray.length == 1) {

          console.log("after myArray 1 1");

          if (text.search("html>") != -1) {
            htmlContent = myArray[0];
            textWithoutTags = '';
          } else {
            htmlContent = null;
            textWithoutTags = myArray[0];
          }


        } else if (myArray.length == 2) {


          if (myArray[0].search("html>") != -1) {
            htmlContent = myArray[0];


            if (myArray[1].length > 0) {
              textWithoutTags = myArray[1] + `<HTML>`;
            }
          } else {
            htmlContent = myArray[1];

            if (myArray[0].length > 0) {
              textWithoutTags = myArray[0] + `<HTML>`;
            }
          }
          console.log("after myArray 1 2");

        } else {

          if (myArray[0].search("html>") != -1) {
            htmlContent = myArray[0];
            textWithoutTags = myArray[1] + myArray[2] + `<HTML>`;
          } else if (myArray[1].search("html>") != -1) {


            let result0 = myArray[1].replace("html>", "xxxx>");
            let result1 = result0.replace("html", "");
            htmlContent = result1.replace("xxxx>", "html>");

            // htmlContent = myArray[1];
            textWithoutTags = myArray[0] + `<HTML>` + myArray[2];
          } else {
            htmlContent = myArray[2];
            textWithoutTags = myArray[0] + myArray[1] + `<HTML>`;
          }
          console.log("after myArray 1 3");



        }


        // console.log(`text.search`);
        // console.log(text.search("```"))

        // if (text.search("html>") == -1) {
        //   textWithoutTags = text
        //   htmlContent = null;
        // }


        this.currentContent = htmlContent;


        if (textWithoutTags.length > 0) {
          this.addMessage({
            own: false,
            message: textWithoutTags,
            time: new Date()
          });
        } else {
          this.addMessage({
            own: false,
            message: "Content updated successfully",
            time: new Date()
          });
        }

        this.isApiResponse = true;
      }).catch(err => {
        this.isApiResponse = true;
      })


    } else if (this.responseFormat == "Image") {


      await this.openAIService.getImage(inputText, this.imageSize, this.temperature, this.token).then(result => {

        this.currentContent = result['data'].data[0].url;

        this.addMessage({
          own: false,
          message: `Image updated successfully`,
          time: new Date()
        });

        this.isApiResponse = true;
      }).catch(err => {
        this.isApiResponse = true;
      })

    } else if (this.responseFormat == "Text") {

      await this.openAIService.getTextContent(inputText, this.temperature, this.token).then(result => {
        this.currentContent = result['message'].content;
        this.addMessage({
          own: false,
          message: `Content updated successfully`,
          time: new Date()
        });
        this.isApiResponse = true;
      }).catch(err => {
        this.isApiResponse = true;
      })

    }



    this.sendRes.emit({
      status: true,
      format: this.responseFormat,
      content: this.currentContent
    });


  }


  UpdateresponseFormat() {

    if (this.responseFormat == 'HTML') {
      this.isHTML = true;
      this.isText = false;
      this.isImage = false;
    } else if (this.responseFormat == 'Text') {
      this.isText = true;
      this.isHTML = false;
      this.isImage = false;
    } else if (this.responseFormat == 'Image') {
      this.isImage = true;
      this.isHTML = false;
      this.isText = false;
    }
  }

  correctText() {
    let message = `correct the spelling mistakes of this text "${this.typeValue}"`;
    this.sendMessage(message, false);

  }
  rephraseText() {
    let message = `rephrase this text "${this.typeValue}"`;
    this.sendMessage(message, false);
  }



}
