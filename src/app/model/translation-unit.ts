import {ITransUnit, INormalizedMessage, STATE_NEW} from 'ngx-i18nsupport-lib';
import {TranslationFile} from './translation-file';
import {NormalizedMessage} from './normalized-message';
import {AutoTranslateServiceAPI} from './auto-translate-service-api';
import {isNullOrUndefined} from 'util';

/**
 * A wrapper around ITransUnit.
 * Adds some support for easier GUI handling.
 * Created by martin on 24.03.2017.
 */

export class TranslationUnit {

  private _isDirty: boolean;
  private _normalizedSourceContent: NormalizedMessage;
  private _normalizedTargetContent: NormalizedMessage;

  constructor(private _translationFile: TranslationFile, private _transUnit: ITransUnit) {
    this._isDirty = false;
  }

  public translationFile(): TranslationFile {
    return this._translationFile;
  }

  public id(): string {
    if (this._transUnit) {
      return this._transUnit.id;
    } else {
      return null;
    }
  }

  public sourceContent(): string {
    if (this._transUnit) {
      return this._transUnit.sourceContent();
    } else {
      return null;
    }
  }

  public sourceContentNormalized(): NormalizedMessage {
    if (this._transUnit) {
      if (!this._normalizedSourceContent) {
        const original = this._transUnit.sourceContent();
        let normalizedMessage: INormalizedMessage = null;
        let parseError: string = null;
        try {
          normalizedMessage = this._transUnit.sourceContentNormalized();
        } catch (error) {
          parseError = error.message;
        }
        this._normalizedSourceContent = new NormalizedMessage(original, normalizedMessage, parseError, normalizedMessage);
      }
      return this._normalizedSourceContent;
    } else {
      return null;
    }
  }

  public targetContent(): string {
    if (this._transUnit) {
      return this._transUnit.targetContent();
    } else {
      return null;
    }
  }

  public targetContentNormalized(): NormalizedMessage {
    if (this._transUnit) {
      if (!this._normalizedTargetContent) {
        const original = this._transUnit.targetContent();
        let normalizedMessage: INormalizedMessage = null;
        let parseError: string = null;
        try {
          normalizedMessage = this._transUnit.targetContentNormalized();
        } catch (error) {
          parseError = error.message;
        }
        this._normalizedTargetContent = new NormalizedMessage(original, normalizedMessage, parseError, this._transUnit.sourceContentNormalized());
      }
      return this._normalizedTargetContent;
    } else {
      return null;
    }
  }

  public description(): string {
    if (this._transUnit) {
      return this._transUnit.description();
    } else {
      return null;
    }
  }

  public meaning(): string {
    if (this._transUnit) {
      return this._transUnit.meaning();
    } else {
      return null;
    }
  }

  public sourceReferences(): {sourcefile: string, linenumber: number}[] {
    if (this._transUnit) {
      return this._transUnit.sourceReferences();
    } else {
      return null;
    }
  }

  public targetState(): string {
    if (this._transUnit) {
      return this._transUnit.targetState();
    } else {
      return null;
    }
  }

  public setTargetState(newState: string) {
    if (this._transUnit) {
      this._transUnit.setTargetState(newState);
    }
  }

  public isDirty(): boolean {
    return this._isDirty;
  }

  public isTranslated(): boolean {
    return this.targetState() && this.targetState() !== STATE_NEW;
  }

  public translate(newTranslation: NormalizedMessage) {
    if (this._transUnit) {
      this._transUnit.translate(newTranslation.nativeString());
      this._isDirty = true;
      this._normalizedSourceContent = null;
      this._normalizedTargetContent = null;
    }
  }

  /**
   * Auto translate this unit via Google Translate.
   * @param autoTranslateService
   */
  public autoTranslateUsingService(autoTranslateService: AutoTranslateServiceAPI) {
    // TODO
    console.log('Autotranslate Unit...');
      if (!this.isTranslated()) {
        const source: NormalizedMessage = this.sourceContentNormalized();
        const translation: string = autoTranslateService.translate(source.dislayText(true), this.translationFile().sourceLanguage(), this.translationFile().targetLanguage());
        if (!isNullOrUndefined(translation)) {
          const newTranslation = source.translate(translation, true);
          // TODO error handling
          this.translate(newTranslation);
        }
      }
  }


}
