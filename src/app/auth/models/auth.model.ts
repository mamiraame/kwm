import {UserModel} from "./user.model";

export class AuthModel {
  token?: string;
  user_data?: UserModel
  status?: string

  setAuth(auth: AuthModel) {
    this.token = auth.token;
    this.user_data=auth.user_data;
    this.status = auth.status;
  }
}
