import { Test } from '@nestjs/testing';
import { TaskStatus } from './task-status.enum';
import { TasksRepository } from './tasks.repository';
import { TasksService } from './tasks.service';

const mockTasksRepository = () => ({
  getTasks: jest.fn(),
  findOne: jest.fn(),
})

const mockUser = {
  username: 'jodi',
  password: 'password',
  id: '1',
  tasks: [],
}

describe('Tasks Service', () => {
  let tasksService: TasksService;
  let tasksRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TasksRepository, useFactory: mockTasksRepository }
      ],
    }).compile();

    tasksService = module.get(TasksService);
    tasksRepository = module.get(TasksRepository);
  })
  
  describe('Get Tasks', () => {
    it('calls tasksRepository.getTasks and returns the result', async () => {
      tasksRepository.getTasks.mockResolvedValue('someValue')
      const result = await tasksService.getTasks(null, mockUser)
      expect(result).toEqual('someValue');
    });
  });

  describe('Get Task By Id', () => {
    it('calls tasksRepository.findOne and returns the result', async () => {
      const mockTask = {
        title: "Task",
        description: "here it is",
        status: TaskStatus.OPEN,
        id: "1",
      };
      await tasksRepository.findOne.mockResolvedValue(mockTask);
      const result = await tasksService.getTaskById('1', mockUser);
      expect(result).toEqual(mockTask);
    });

    it('calls tasksRepository.findOne and handles an error', async () => {
      tasksRepository.findOne.mockResolvedValue(null);
      expect(tasksService.getTaskById).rejects.toThrow();
    });
  });
  
})
