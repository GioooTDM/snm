export const titlesMap = {
    changeName: "Change Name",
    changeSurname: "Change Surname",
    changeEmail: "Change Email",
    changePassword: "Change Password",
    deleteAccount: "Delete Account"
};

export const placeholdersMap = {
    changeName: "Enter new name...",
    changeSurname: "Enter new surname...",
    changeEmail: "Enter new email...",
    changePassword: " << Questo non mi serve >> ",
    deleteAccount: "Type \"DELETE\" to confirm"
};

export const buttonTextMap = {
    changeName: "Set Name",
    changeSurname: "Set Surname",
    changeEmail: "Set Email",
    changePassword: "Set Password",
    deleteAccount: "Confirm Deletion"
};

export const apiEndpointsMap = {
    changeName: { url: "/api/user/update", method: 'PUT' },
    changeSurname: { url: "/api/user/update", method: 'PUT' },
    changeEmail: { url: "/api/user/update", method: 'PUT' },
    changePassword: { url: "/api/user/change-password", method: 'PUT' },
    deleteAccount: { url: "/api/user/delete", method: 'DELETE' }
};
