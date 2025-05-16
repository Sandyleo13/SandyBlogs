
import { APP_NAME } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground py-6 text-center shadow-inner mt-auto">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} {APP_NAME}. All rights reserved.</p>
        <p className="text-sm mt-1">Crafted with passion.</p>
      </div>
    </footer>
  );
}
