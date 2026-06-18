import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import {
  provideLucideIcons,
  LucideLayoutDashboard, LucideMegaphone, LucideGlobe, LucideLayoutGrid, LucideCheckSquare, LucideUsers, LucideTrendingUp,
  LucideLogOut, LucideZap, LucideShieldCheck, LucideX, LucideEye, LucideMousePointerClick, LucidePercent, LucideDollarSign,
  LucidePlay, LucidePause, LucideSend, LucideTrash2, LucideArrowLeft, LucideEdit, LucidePlus, LucideImage, LucideToggleLeft, LucideToggleRight,
  LucideShieldAlert, LucideArrowRight, LucideMail, LucideLock, LucideUser, LucideCheckCircle
} from '@lucide/angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideLucideIcons(
      LucideLayoutDashboard, LucideMegaphone, LucideGlobe, LucideLayoutGrid, LucideCheckSquare, LucideUsers, LucideTrendingUp,
      LucideLogOut, LucideZap, LucideShieldCheck, LucideX, LucideEye, LucideMousePointerClick, LucidePercent, LucideDollarSign,
      LucidePlay, LucidePause, LucideSend, LucideTrash2, LucideArrowLeft, LucideEdit, LucidePlus, LucideImage, LucideToggleLeft, LucideToggleRight,
      LucideShieldAlert, LucideArrowRight, LucideMail, LucideLock, LucideUser, LucideCheckCircle
    )
  ]
};
