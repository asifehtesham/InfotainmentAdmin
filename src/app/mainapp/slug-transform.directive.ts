import { Directive, HostListener } from "@angular/core";
import { ControlContainer } from "@angular/forms";

@Directive({
  selector: "[formControlName][appSlugTransform]"
})
export class SlugTransformDirective {
  constructor(private controlContainer: ControlContainer) {}

  @HostListener("ngModelChange", ["$event"])
  onModelChange(event) {
    let newVal = this.transform(event);
    const control = this.controlContainer.control.get('slug');
    control.patchValue(newVal)
  }

  transform(value) {
    let text = value.toLowerCase();
    if (text.charAt(0) == " ") {
      text = text.trim();
    }
    if (text.charAt(text.length - 1) == "-") {
      //text = (text.replace(/-/g, ""));
    }
    text = text.replace(/ +/g, "-");
    text = text.replace(/--/g, "-");
    text = text.normalize("NFKD").replace(/[\u0300-\u036f]/g, ""); // Note: Normalize('NFKD') used to normalize special alphabets like óã to oa
    text = text.replace(/[^a-zA-Z0-9 -]/g, "");

    return text;
  }
}
