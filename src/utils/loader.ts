import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export const Loader = () => {
    NProgress.start();
    const timeout = setTimeout(() => {
      NProgress.done();
    }, 1500);

    return () => clearTimeout(timeout);
}