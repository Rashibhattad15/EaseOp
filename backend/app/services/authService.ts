// src/services/authService.ts
import admin from '../config/firebase';
import { UserConfigurationModel } from '../../../commons/models/configurations/userconfiguration';
import { getRoleById } from '../services/roleService';
export const registerUser = async (email: string, password: string, username: string, roleId: string, officeId: string) => {
  try {
      console.log("Registering user with roleId:", roleId);

      // Fetch role data to get accessible screens
      const roleData = await getRoleById(officeId, roleId);
      if (!roleData) {
          throw new Error("Invalid roleId, role does not exist.");
      }

      // Create user in Firebase Authentication
      const userRecord = await admin.auth().createUser({
          email,
          password,
          displayName: username
      });

      // Assign custom claims (roles and accessible screens)
      await admin.auth().setCustomUserClaims(userRecord.uid, { 
          roleId, 
          roleName: roleData.name,
          screensAccessible: roleData.screensAccessible || [] 
      });

      // Fetch and log the custom claims after setting them
      const updatedUser = await admin.auth().getUser(userRecord.uid);
      console.log("Custom Claims after update:", updatedUser.customClaims);

      // Create user object
      const userData: UserConfigurationModel = {
          uid: userRecord.uid,
          username,
          email,
          roleId,
          createdOn: new Date()
      };

      // Save user data to Firebase Realtime Database
      await admin.database().ref(`offices/${officeId}/users/${userRecord.uid}`).set(userData);

      console.log("User Registered:", userRecord, userData, updatedUser.customClaims);

      return { uid: userRecord.uid, userRecord, userData, roleData, customClaims: updatedUser.customClaims };
  } catch (error) {
      console.error('Error registering user:', error);
      throw new Error('Failed to register user. ' + (error as Error).message);
  }
};


export const deleteUser = async (uid: string) => {
  return await admin.auth().deleteUser(uid);
};

export const updateUser = async (uid: string, updates: Partial<admin.auth.UpdateRequest>) => {
  return await admin.auth().updateUser(uid, updates);
};

export const getUserByEmail = async (email: string) => {
  return await admin.auth().getUserByEmail(email);
};
