import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { BackendService } from './backend.service';

@Injectable({
    providedIn: 'root'
})
export class InitializerService {


    constructor(private userService: UserService, private backend: BackendService) { }

    initialize(): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            const user = this.userService.getSocialUser();
            //TODO: check cached jwt token and delete if expired or invalid (or just let backend handle it)

            if (user) {
                this.userService.setSocialUser(user);
                this.backend.updateAndVerifyUser(user.idToken).subscribe(result => {
                    //console.log(result);
                    this.userService.setBackendUser(result);
                    //this.router.navigate(['user']);
                    resolve();
                }, error => {
                    resolve()
                });
            } else {
                resolve();
            }
        });
    }
}