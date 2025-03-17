import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => {
    console.error(err);
    document.body.innerHTML = `
      <h1>🛑 Application initialization failed</h1>
      <h2>&nbsp;ℹ️ Press &lt;F12&gt; to check the browser console for details.</h2>
    `;
  });
