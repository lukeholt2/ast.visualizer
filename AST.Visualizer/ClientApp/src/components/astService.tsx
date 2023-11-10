import axios from "axios";
import {singleton} from "tsyringe";
import { BehaviorSubject, Observable } from 'rxjs';

@singleton()
export class ASTService {

  // TODO: doesnt follow naming standards
  private _currentData: BehaviorSubject<any> = new BehaviorSubject(null);

  currentData: Observable<any> = this._currentData.asObservable();

  get currentLanguage(): string{
    return "csharp";
  }

  /** Clear the currently loaded data (if any) */
  clear(){
    this._currentData.next(null);
  }

  /** Request the server to parse the text|file
   * Sets the current with the parsed data contained in the response
   */
  async parse(file: string | Blob, language?: string) {
    const formData = new FormData();
    formData.append('File', file);
    if (language) { formData.append('language', language); }
    await axios.post('ast/parse', formData)
      .then((data) => this._currentData.next(data.data))
      .catch((error) => {
        console.log(error);
        this._currentData.next(null);
      });
  }
}
