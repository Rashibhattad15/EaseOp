const register = require('../../controllers/authController').register;

// Mock the Firebase admin module
jest.mock('../../config/firebase', () => ({
  auth: jest.fn(),
  database: jest.fn()
}));
const admin = require('../../config/firebase');

// Mock the user model and UID generator so we control the UID value.
jest.mock('../../models/userModel', () => {
  return {
    UserConfigurationModel: function({ uid, username, email, role }) {
      this.uid = uid;
      this.username = username;
      this.email = email;
      this.role = role;
    },
    generateUserUID: jest.fn(() => 'USER-123456789')
  };
});
const { UserConfigurationModel, generateUserUID } = require('../../models/userModel');

describe('Register Endpoint', () => {
  let req, res;
  
  beforeEach(() => {
    req = {
      body: {
        email: 'test123@example.com',
        password: 'password123',
        role: 'User',
        officeId: 'office123',
        username: 'testuser'
      }
    };
    
    res = {
      json: jest.fn(),
      status: jest.fn(() => res)
    };

    jest.clearAllMocks();
  });

  test('should register a user successfully', async () => {
    // Mock Firebase Auth createUser and deleteUser functions
    const createUserMock = jest.fn().mockResolvedValue({ uid: 'USER-123456789', email: 'test123@example.com' });
    const deleteUserMock = jest.fn(); // Not used in success scenario
    admin.auth.mockImplementation(() => ({
      createUser: createUserMock,
      deleteUser: deleteUserMock
    }));

    // Mock Firebase Database set function
    const setMock = jest.fn().mockResolvedValue();
    admin.database.mockImplementation(() => ({
      ref: jest.fn(() => ({
        set: setMock
      }))
    }));

    // Execute the register function
    await register(req, res);
    
    // Verify that our UID generator was called
    expect(generateUserUID).toHaveBeenCalled();
    
    // Verify that Firebase Auth's createUser was called with the generated UID and proper credentials
    expect(createUserMock).toHaveBeenCalledWith({ 
      generateUid: 'USER-123456789',  // based on your provided code; ideally, this key should be 'uid'
      email: 'test123@example.com', 
      password: 'password123'
    });
    
    // Verify that the user data was stored in the Realtime Database correctly
    expect(setMock).toHaveBeenCalledWith({
      uid: 'USER-123456789',
      username: 'testuser',
      email: 'test123@example.com',
      role: 'User'
    });
    
    // Verify that the response JSON is sent with the new user data
    expect(res.json).toHaveBeenCalledWith({
      uid: 'USER-123456789',
      username: 'testuser',
      email: 'test123@example.com',
      role: 'User'
    });
  });

  describe('Negative Scenarios', () => {
    test('should return 400 if required fields are missing', async () => {
      // Remove the email to simulate missing required field
      req.body.email = '';
      
      await register(req, res);
      
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "Email, password, officeId, and username are required."
      });
    });
  
    test('should handle error during database write and rollback successfully', async () => {
      // Simulate success for createUser
      const createUserMock = jest.fn().mockResolvedValue({ uid: 'USER-123456789', email: 'test123@example.com' });
      // Simulate failure for database write (set)
      const setMock = jest.fn().mockRejectedValue(new Error("Database error"));
      // Simulate successful rollback
      const deleteUserMock = jest.fn().mockResolvedValue();
      admin.auth.mockImplementation(() => ({
        createUser: createUserMock,
        deleteUser: deleteUserMock
      }));
      admin.database.mockImplementation(() => ({
        ref: jest.fn(() => ({
          set: setMock
        }))
      }));
  
      await register(req, res);
  
      expect(createUserMock).toHaveBeenCalled();
      expect(setMock).toHaveBeenCalled();
      // Ensure rollback is called
      expect(deleteUserMock).toHaveBeenCalledWith('USER-123456789');
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  
    test('should handle error during database write and rollback failure, still return error', async () => {
      // Simulate success for createUser
      const createUserMock = jest.fn().mockResolvedValue({ uid: 'USER-123456789', email: 'test123@example.com' });
      // Simulate failure for database write (set)
      const setMock = jest.fn().mockRejectedValue(new Error("Database error"));
      // Simulate rollback failure
      const deleteUserMock = jest.fn().mockRejectedValue(new Error("Rollback error"));
      admin.auth.mockImplementation(() => ({
        createUser: createUserMock,
        deleteUser: deleteUserMock
      }));
      admin.database.mockImplementation(() => ({
        ref: jest.fn(() => ({
          set: setMock
        }))
      }));
  
      await register(req, res);
  
      expect(createUserMock).toHaveBeenCalled();
      expect(setMock).toHaveBeenCalled();
      expect(deleteUserMock).toHaveBeenCalledWith('USER-123456789');
      expect(res.status).toHaveBeenCalledWith(400);
      // We expect the original error message to be returned regardless of rollback failure.
      expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
    });
  });
});
