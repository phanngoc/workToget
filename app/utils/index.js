import seed_project from './faker_project';
import seed_user from './faker_user';
import seed_frame from './faker_frame';
import seed_task from './faker_task';
import seed_label from './faker_label';

export default function seed() {
  seed_project();
  seed_user();
  seed_frame();
  seed_task();
  seed_label();
}
