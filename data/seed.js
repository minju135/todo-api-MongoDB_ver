import mongoose, { Mongoose } from 'mongoose';
import data from './mock.js';
import Task from '../models/Task.js';
import * as dotenv from 'dotenv';
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL

console.log('DATABASE_URL:', DATABASE_URL);

mongoose.connect(process.env.DATABASE_URL);

await Task.deleteMany({}); //삭제 조건을 파라미터로 받음
await Task.insertMany(data); //삽인할 데이터를 파라미터로 받음

mongoose.connection.close();