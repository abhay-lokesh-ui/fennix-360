const statusCodes = {
    200: {
        devMsg: 'OK', userMsg: {
            EN_US: 'OK',
            PT_PT: 'OK',
            DT_DT: 'OK',
            ES_ES: 'OK',
            FR_FR: 'OK',
            GR_GR: 'OK',
            HT_HC: 'OK'
        }
    },
    220: {
        devMsg: 'no groups available for the given id', userMsg: {
            EN_US: 'no groups available for the given id',
            PT_PT:'Nenhum grupo disponível para o ID fornecido',
            DT_DT:'geen groepen beschikbaar voor de gegeven id',
            ES_ES:'no hay grupos disponibles para la identificación dada',
            FR_FR:'aucun groupe disponible pour l\'identifiant donné',
            GR_GR:'Keine Gruppen für die angegebene ID verfügbar',
            HT_HC:'pa gen okenn gwoup ki disponib pou id la'
        }
    },
    207: {
        devMsg: 'no cards available for the user', userMsg: {
            EN_US: 'no cards available for the user',
            espMX: 'no cards available for the user',
            espLA: 'no cards available for the user'
        }
    },
    209: {
        devMsg: 'no roles available for the given id', userMsg: {
            EN_US: 'no roles available for the given id',
            espMX: 'no roles available for the given id',
            espLA: 'no roles available for the given id'
        }
    },
    210: {
        devMsg: 'no filters available for the given id', userMsg: {
            EN_US: 'no filters available for the given id',
            espMX: 'no filters available for the given id',
            espLA: 'no filters available for the given id'
        }
    },
    211: {
        devMsg: 'no roles available for the given id', userMsg: {
            EN_US: 'no roles available for the given id',
            espMX: 'no roles available for the given id',
            espLA: 'no roles available for the given id'
        }
    },
    212: {
        devMsg: 'no simcards available for the given id', userMsg: {
            EN_US: 'no simcards available for the given id',
            espMX: 'no simcards available for the given id',
            espLA: 'no simcards available for the given id'
        }
    },
    213: {
        devMsg: 'no devices available for the given id', userMsg: {
            EN_US: 'no devices available for the given id',
            espMX: 'no devices available for the given id',
            espLA: 'no devices available for the given id'
        }
    },
    600: {
        devMsg: 'User email and password Match', userMsg: {
            EN_US: 'Logged in Succesfully',
            espMX: 'conectado con éxito',
            espLA: 'conectado con éxito'
        }
    },
    601: {
        devMsg: 'User email present id db', userMsg: {
            EN_US: 'User email present',
            espMX: 'correo electrónico de usuario presente',
            espLA: 'correo electrónico de usuario presente'
        }
    },
    602: {
        devMsg: 'User email not present', userMsg: {
            EN_US: 'Email is not present.Please ask your admin to add it',
            espMX: 'El correo electrónico no está presente.Pídale a su administrador que lo agregue',
            espLA: 'El correo electrónico no está presente.Pídale a su administrador que lo agregue'
        }
    },
    603: {
        devMsg: 'User is retired', userMsg: {
            EN_US: 'Unauthorised entry',
            espMX: 'Usuario no autorizado',
            espLA: 'Usuario no autorizado'
        }
    },
    604: {
        devMsg: 'Password is incorrect', userMsg: {
            EN_US: 'Password is incorrect',
            espMX: 'La contraseña es incorrecta',
            espLA: 'La contraseña es incorrecta'
        }
    },
    605: {
        devMsg: 'Failed to add user', userMsg: {
            EN_US: 'Oops,User not added',
            espMX: 'Uy usuario no agregado',
            espLA: 'Uy usuario no agregado'
        }
    },
    606: {
        devMsg: 'Failed to change user password', userMsg: {
            EN_US: 'Failed to change password.Please try again',
            espMX: 'no se pudo cambiar la contraseña Inténtalo de nuevo',
            espLA: 'no se pudo cambiar la contraseña Inténtalo de nuevo'
        }
    },
    214: {
        devMsg: 'no centers available for the given id', userMsg: {
            EN_US: 'no centers available for the given id',
            espMX: 'no centers available for the given id',
            espLA: 'no centers available for the given id'
        }
    },
    216: {
        devMsg: 'no countries available for the given id', userMsg: {
            EN_US: 'no countries available for the given id',
            espMX: 'no countries available for the given id',
            espLA: 'no countries available for the given id'
        }
    },
    217: {
        devMsg: 'no device types available for the given id', userMsg: {
            EN_US: 'no device types available for the given id',
            espMX: 'no device types available for the given id',
            espLA: 'no device types available for the given id'
        }
    },
    218: {
        devMsg: 'no dropdown for this dropdown Id', userMsg: {
            EN_US: 'no dropdown for this dropdown Id',
            espMX: 'no dropdown for this dropdown Id',
            espLA: 'no dropdown for this dropdown Id'
        }
    },
    219: {
        devMsg: 'no simcard types available for the given id', userMsg: {
            EN_US: 'no simcard types available for the given id',
            espMX: 'no simcard types available for the given id',
            espLA: 'no simcard types available for the given id'
        }
    },
    700: {
        devMsg: 'Postgres DB is not getting connected', userMsg: {
            EN_US: 'Server is down',
            espMX: 'El servidor está caído',
            espLA: 'El servidor está caído'
        }
    },
    701: {
        devMsg: 'mongoDB is not getting connected', userMsg: {
            EN_US: 'Server is down',
            espMX: 'El servidor está caído',
            espLA: 'El servidor está caído'
        }
    },
    900: {
        devMsg: 'Status code is not a number'
    }
};

module.exports = {statusCodes};