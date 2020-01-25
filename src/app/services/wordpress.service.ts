import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WordpressService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://challenge.com/preview/wp-json/getLearningtools/v2/'
    );
  }

  login(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://challenge.com/preview/wp-json/userAuth/v2/'
    );
  }

  logout(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://challenge.com/preview/wp-json/setUserLogout/v2/'
    );
  }

  saveData(userInfo: any): Observable<any[]> {
    return this.http.post<any[]>(
      'https://challenge.com/preview/wp-json/sendUserLearnData/v2/',
      userInfo
    );
  }

  setUserLogin(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://challenge.com/preview/wp-json/setUserLogin/v2/'
    );
  }

  uploadFile(data) {
    return this.http.post<any[]>(
      'https://challenge.com/preview/wp-json/image-upload/v2/',
      data
    );
  }

  uploadVideoFile(data) {
    return this.http.post<any[]>(
      'https://challenge.com/preview/wp-json/video-upload/v2/',
      data);
  }

  uploadVideoByUrl(url) {
    return this.http.post<any[]>(
      'https://challenge.com/preview/wp-json/video-upload-url/v2/',
      url);
  }


  getUserExperience(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://challenge.com/preview/wp-json/get-user-experience/v2/'
    );
  }

  saveExperienceData(experienceInfo: any): Observable<any[]> {
    return this.http.post<any[]>(
      'https://challenge.com/preview/wp-json/save-user-experience/v2/',
      experienceInfo
    );
  }

  getExperienceBenefits(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://pg-app-9dfh2kb0auoxwzcgrca8678kjc14dc.scalabl.cloud/v1/benefits'
    );
  }

  getActiveCountryList(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://challenge.com/preview/wp-json/get-country-list/v2/'
    );
  }


  sendMail(emailInfo: any): Observable<any[]> {
    return this.http.post<any[]>(
      'https://challenge.com/preview/wp-json/send-experience-email/v2/',
      emailInfo
    );
  }

  getExperienceByRef(): Observable<any[]> {
    return this.http.get<any[]>(
      'https://pg-app-9dfh2kb0auoxwzcgrca8678kjc14dc.scalabl.cloud/v1/experiences/refCode/go'
    );
  }

}
