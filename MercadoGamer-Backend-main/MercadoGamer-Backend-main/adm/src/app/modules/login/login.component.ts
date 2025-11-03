import { Component, OnInit } from "@angular/core";
import { FormBuilder, Validators } from "@angular/forms";
import { BaseComponent } from "src/app/core/base.component";
import { PageService } from "../../core/page.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"],
})
export class LoginComponent extends BaseComponent {
  sent: boolean;

  getFormNew() {
    return this.formBuilder.group({
      username: [null, Validators.required],
      password: [null, Validators.required],
    });
  }

  onSubmitPerform(item) {
    let endPoint =
      this.settings.endPoints.administrators +
      this.settings.endPointsMethods.administrators.login;

    this.sent = true;

    this.pageService
      .httpPost(endPoint, item)
      .then((res) => this.savePost(res.data))
      .catch((e) => this.pageService.showError(e))
      .finally(() => (this.sent = false));
  }

  savePost(item) {
    this.global.saveUser(item);
    this.pageService.showSuccess("Bienvenido!");
    this.pageService.navigateRoute("tickets");
  }
}
