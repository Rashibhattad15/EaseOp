// src/controllers/authController.ts
import { Request, Response } from 'express';
import * as authService from '../services/authService';

export const registerUser = async (req: Request, res: Response) => {
    const { userName, email, password, roleId, officeId } = req.body;

    if (!userName || !email || !password || !roleId || !officeId) {
      res.status(400).json({ error: 'Missing required fields' });
  }

    try {
      const userRecord = await authService.registerUser(email, password, userName, roleId, officeId);
      res.status(201).json({ message: 'User registered and role set', uid: userRecord.uid });
    } catch (err: any) {
      console.error('Error in registerUser:', err);
      res.status(500).json({ error: err.message });
    }
  };;

export const getUser = async (req: Request, res: Response) => {
  res.status(200).json({name:"Rashi"});
}

export const editUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    const updates = req.body;
    const updatedUser = await authService.updateUser(uid, updates);
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { uid } = req.params;
    await authService.deleteUser(uid);
    res.status(200).json({ message: 'User deleted' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
