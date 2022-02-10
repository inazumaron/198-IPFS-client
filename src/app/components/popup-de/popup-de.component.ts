import { Component, Input } from "@angular/core";

@Component({
  selector: 'app-popup-de',
  templateUrl: './popup-de.component.html',
  styleUrls: ['./popup-de.component.css']
})
export class PopupDeComponent {
  @Input() placeholder = "";
  value: string = "";
  passcode: string = "";
}
