import { AuthModel } from './auth.model';


export class UserModel extends AuthModel {
  id?: number;
  name?: string;
  email?: string;
  username?: string;
  company_id?: string;
  contact?: string;
  pic?: string;
  created_at?: string;
  email_verified_at:any




  setUser(_user: unknown) {
    const user = _user as UserModel;
    this.id = user.id;
    this.name = user.name || '';
    this.company_id = user.company_id || '';
    this.created_at = user.created_at || '';
    this.email = user.email || '';
    this.pic = user.pic || './assets/media/avatars/blank.png';
  }
}
