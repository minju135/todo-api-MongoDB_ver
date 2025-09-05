import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxLength: 30,
    },
    description: {
      type: String,
    },
    isComplete: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  {
    timestamps: true
  },
);

const Task = mongoose.model('Task', TaskSchema); // tasks 컬렉션을 조회, 수정, 삭제

export default Task;