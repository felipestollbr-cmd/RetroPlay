import { motion } from 'framer-motion';
import AISearch from '../components/AISearch';

export default function AISearchPage() {
  return (
    <div className="min-h-screen pb-20">
      <div className="pt-8 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <AISearch />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
