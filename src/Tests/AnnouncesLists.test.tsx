import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnnouncesLists from '../Components/Home/AnnouncesLists'; // Mettez à jour le chemin d'importation selon l'emplacement de votre fichier
import * as publicService from '../Services/Public';
import ParticipationsService from '../Services/Participations';
import Authentification from '../Services/Authentification';
import AnnounceData from '../Types/Announce.types';
import { jest } from '@jest/globals'; // Assurez-vous d'importer jest

// Mock des services et du navigateur
jest.mock('../../Services/Public', () => ({
    getAllSports: jest.fn(),
}));
jest.mock('../../Services/Participations', () => ({
    getMyAllParticipations: jest.fn(),
    participer: jest.fn(),
}));
jest.mock('../../Services/Authentification', () => ({
    getProfile: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('AnnouncesLists', () => {
    beforeEach(() => {
        // Reset des mocks avant chaque test
        jest.clearAllMocks();
    });

    it('affiche les annonces sportives après le chargement des données', async () => {
        const mockOrganizer = {
            phoneNumber: 1234567890, // Un numéro de téléphone factice
            userName: 'JohnDoe', // Un nom d'utilisateur factice
            email: 'john.doe@example.com', // Un email factice
            password: 'password123', // Un mot de passe factice (n'utilisez jamais de vrais mots de passe dans les données factices)
            address: '123 Fake Street', // Une adresse factice
            city: 'Faketown', // Une ville factice
            yearBirth: 1985, // Une année de naissance factice
            _id: 'user123' // Un ID utilisateur factice
        };
        const sports: AnnounceData[] = [
            // Vos données factices pour un sport
            {
                _id: 'sport1',
                sport: 'Football',
                numberOfPeopleMax: 22,
                numberOfPeopleCurrent: 10,
                date: new Date().toISOString(),
                startTime: new Date().toISOString(),
                endTime: new Date().toISOString(),
                address: '123 Sport Street',
                city: 'Sportsville',
                ageMin: 18,
                ageMax: 35,
                price: 15.00,
                organizer: mockOrganizer, // Utilisez l'objet UserData factice ici
            },
            // ... plus d'objets si nécessaire
        ];
        jest.mock('../../Services/Public', () => ({
            __esModule: true, // Ceci est nécessaire pour mock un module ES6
            default: {
              getAllSports: jest.fn() // Mock seulement la fonction que vous allez utiliser
            }
          }));

        render(<AnnouncesLists />);

        // Vérifiez que les données sont affichées correctement
        await waitFor(() => {
            expect(screen.getByText('Nom du sport')).toBeInTheDocument();
        });
    });

    // Ajoutez plus de tests pour simuler les interactions et vérifier les comportements
    // Par exemple, tester le clic sur le bouton de participation, etc.
});
