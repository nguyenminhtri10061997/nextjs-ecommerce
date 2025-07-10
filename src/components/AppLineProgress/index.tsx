'use client';
import LinearProgress from "@mui/material/LinearProgress";
import { motion } from 'framer-motion'

export default function AppLineProgress() {
  return (
    <motion.div
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', zIndex: 1700 }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1 }}
    >
      <LinearProgress/>
    </motion.div>
  )
}
