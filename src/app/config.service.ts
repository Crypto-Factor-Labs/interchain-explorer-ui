import { Injectable } from '@angular/core';
import * as Joi from 'joi-browser';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config = environment;

  constructor() {
    this.validateConfig();
  }

  private validateConfig(): void {
    // Define a Joi schema for the environment variables
    const schema = Joi.object({
      APP_BASE_URL: Joi.string().uri().required(),
      APP_POLL_FREQ: Joi.number().min(0).default(60000),
    }).unknown();  // Also allow other variables

    // Validate the config object against the schema
    const { error, value } = schema.validate(this.config);

    if (error) {
      throw new Error(`🛑 Invalid environment configuration: ${error.message}`);
    } else {
      console.log('✅ Environment configuration validated successfully.');
      this.config = value;  // Update the config with any defaults/transformed values from Joi
    }
  }

  // Getters for the configuration properties
  get appBaseUrl(): string {
    return this.config.APP_BASE_URL;
  }

  get appPollFreq(): number {
    return this.config.APP_POLL_FREQ;
  }
}
