import * as admin from 'firebase-admin';
import { UserRole } from '../../../commons/models/configurations/UserRole';

// Function to get role details based on roleId
export const getRoleById = async (officeId: string, roleId: string): Promise<UserRole | null> => {
    try {
        console.log(`Fetching role data for roleId: ${roleId}`);

        const roleRef = admin.database().ref(`offices/${officeId}/roles/${roleId}`);
        const snapshot = await roleRef.once('value');

        if (!snapshot.exists()) {
            console.warn(`Role with ID ${roleId} not found in office ${officeId}`);
            return null;
        }

        return snapshot.val() as UserRole;
    } catch (error) {
        console.error("Error fetching role data:", error);
        throw new Error(`Failed to get role: ${(error as Error).message}`);
    }
};
