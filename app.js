import express from "express";
import tasks from './data/mock.js';
import * as dotenv from 'dotenv';
dotenv.config(); //.env파일의 변수를 process.env 객체로 로딩
import Task from "./models/Task.js";
import mongoose from 'mongoose'
import cors from 'cors';

const app = express();
app.use(cors())
app.use(express.json()); //req.body로 접근하기 위해 필요함

function asyncHandler(handler) {
  return async function (req, res) {
    try{
      await handler(req, res);
    } catch (e) {
      if (e.name === 'ValidationError') {
        res.status(400).send({ message: e.message})
      } else if (e.name === 'CastError') {
        res.status(404).send({ message: 'Cannot find given id.'})
      } else {
        res.status(500).send({ message: e.message })
      }
    }
  }
}

//GET /tasks - 전체 조회
app.get('/tasks', asyncHandler(async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count) || 0;

  const sortOption = { 
    createdAt: sort === 'oldest' ? 'asc' : 'desc'
  };
  const tasks = await Task.find().sort(sortOption).limit(count); // 여러 개체를 가져옴, 모두 query를 반환함

  res.json(tasks);
}));

//GET /tasks/:id - 특정 태스크 조회
app.get('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id; //항상 문자열
  const task = await Task.findById(id);
  if (task) {
      res.json(task);
  } else {
    res.status(404).json({ message: 'Cannot find given id.' }); //상태 코드 설정
  }
}));

//task 추가하기
app.post('/tasks', asyncHandler(async (req, res) => {
  const newTask = await Task.create(req.body)
  res.status(201).send(newTask);
}));

app.patch('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findById(id);
  if (task) {
    Object.keys(req.body).forEach((key) => {
      task[key] = req.body[key];
    })
    await task.save() //수정한 테스크 저장
    res.send(task);
  } else {
    res.status(404).json({ message: 'Cannot find given id.' });
  }
}));

app.delete('/tasks/:id', asyncHandler(async (req, res) => {
  const id = req.params.id;
  const task = await Task.findByIdAndDelete(id); //객체를 찾고 삭제까지 해줌, 해당 아이디를 가진 객체를 못 찾으면 null 반환
  if (task) {
    res.sendStatus(204);
  } else {
    res.status(404).json({ message: 'Cannot find given id.' });
  }
}));

// 서버 시작
app.listen(process.env.PORT || 3000, () => console.log('Server Started'));

mongoose.connect(process.env.DATABASE_URL).then(() => console.log('Connected to DB'));