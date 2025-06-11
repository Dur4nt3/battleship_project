import PlacementInfo from '../gameLogic/placementInfo';

describe('Tests for PlacementInfo class', () => {
    let shipPlacement;

    // Initialize shipPlacement before every test (fresh object)
    beforeEach(() => {
        shipPlacement = new PlacementInfo();
    });

    test('Can create instance of PlacementInfo', () => {
        expect(shipPlacement instanceof PlacementInfo).toBeTruthy();
    });

    test('Instances are constructed with the correct properties and values', () => {
        expect(shipPlacement).toEqual({
            carrier5: null,
            battleship4: null,
            destroyer3: null,
            submarine3: null,
            patrol2: null,
        });
    });

    test('Can validate ship size', () => {
        expect.assertions(5);

        expect(PlacementInfo.isValidShipSize(5)).toBeTruthy();
        expect(PlacementInfo.isValidShipSize(2)).toBeTruthy();

        expect(PlacementInfo.isValidShipSize('5')).toBeFalsy();
        expect(PlacementInfo.isValidShipSize(6)).toBeFalsy();
        expect(PlacementInfo.isValidShipSize(3.5)).toBeFalsy();
    });

    test('Can validate ship type', () => {
        expect.assertions(4);

        expect(PlacementInfo.isValidShipType('carrier5')).toBeTruthy();
        expect(PlacementInfo.isValidShipType('submarine3')).toBeTruthy();

        expect(PlacementInfo.isValidShipType('carrier4')).toBeFalsy();
        expect(PlacementInfo.isValidShipType('patrol')).toBeFalsy();
    });

    test('Can check if a given string is a valid coordinate', () => {
        expect.assertions(7);

        expect(PlacementInfo.isValidCoordinate('a5')).toBeTruthy();
        expect(PlacementInfo.isValidCoordinate('c10')).toBeTruthy();
        expect(PlacementInfo.isValidCoordinate('j7')).toBeTruthy();

        // Correct format ([character][integer]) but values are out of the board
        expect(PlacementInfo.isValidCoordinate('m5')).toBeFalsy();
        expect(PlacementInfo.isValidCoordinate('b11')).toBeFalsy();

        // Invalid format
        expect(PlacementInfo.isValidCoordinate('e4.5')).toBeFalsy();
        expect(PlacementInfo.isValidCoordinate('abcd')).toBeFalsy();
    });

    test('Can validate ship placement', () => {
        expect.assertions(8);

        expect(
            PlacementInfo.isValidPlacement(5, 'h', ['a1', 'a5'])
        ).toBeTruthy();
        expect(
            PlacementInfo.isValidPlacement(2, 'v', ['e4', 'f4'])
        ).toBeTruthy();
        expect(
            PlacementInfo.isValidPlacement(4, 'h', ['b6', 'b9'])
        ).toBeTruthy();

        // Basic checks
        expect(
            PlacementInfo.isValidPlacement(3, 'h', ['a1', 'j6'])
        ).toBeFalsy();
        expect(
            PlacementInfo.isValidPlacement(3, 'v', ['a8', 'a10'])
        ).toBeFalsy();

        // Ensures that you're not only checking whether the change in the character/number is correct
        expect(
            PlacementInfo.isValidPlacement(2, 'h', ['a1', 'b2'])
        ).toBeFalsy();
        expect(
            PlacementInfo.isValidPlacement(3, 'v', ['d2', 'f8'])
        ).toBeFalsy();

        // Alignment is represented as 'v' (for vertical) or 'h' (horizontal), no other values are accepted
        expect(
            PlacementInfo.isValidPlacement(4, 'horizontal', ['a1', 'a4'])
        ).toBeFalsy();
    });

    // Input validation is the responsibility of all the above tested methods (and isFree below)
    // By the time this method is executed, the input should be 100% valid
    test('Can set ship placements on an instance', () => {
        expect.assertions(3);

        shipPlacement.setPlacement('carrier5', 'h', ['a1', 'a5']);

        expect(shipPlacement).toEqual({
            carrier5: { alignment: 'h', squares: ['a1', 'a2', 'a3', 'a4', 'a5'] },
            battleship4: null,
            destroyer3: null,
            submarine3: null,
            patrol2: null,
        });

        shipPlacement.setPlacement('battleship4', 'v', ['e6', 'h6']);
        shipPlacement.setPlacement('patrol2', 'h', ['b3', 'b4']);

        expect(shipPlacement).toEqual({
            carrier5: { alignment: 'h', squares: ['a1', 'a2', 'a3', 'a4', 'a5'] },
            battleship4: { alignment: 'v', squares: ['e6', 'f6', 'g6', 'h6'] },
            destroyer3: null,
            submarine3: null,
            patrol2: { alignment: 'h', squares: ['b3', 'b4'] },
        });

        shipPlacement.setPlacement('carrier5', 'h', ['a6', 'a10']);

        expect(shipPlacement).toEqual({
            carrier5: { alignment: 'h', squares: ['a6', 'a7', 'a8', 'a9', 'a10'] },
            battleship4: { alignment: 'v', squares: ['e6', 'f6', 'g6', 'h6'] },
            destroyer3: null,
            submarine3: null,
            patrol2: { alignment: 'h', squares: ['b3', 'b4'] },
        });
    });

    test('Can check whether a given square range is occupied', () => {
        expect.assertions(6);

        shipPlacement.setPlacement('carrier5', 'v', ['a1', 'a5']);

        expect(shipPlacement.isFree(['c1', 'e1'])).toBeTruthy();
        expect(shipPlacement.isFree(['a2', 'a4'])).toBeFalsy();

        shipPlacement.setPlacement('patrol2', 'h', ['d6', 'e6']);

        expect(shipPlacement.isFree(['d5', 'd7'])).toBeFalsy();
        expect(shipPlacement.isFree(['e4', 'e5'])).toBeTruthy();

        shipPlacement.setPlacement('submarine3', 'v', ['h2', 'h4']);
        shipPlacement.setPlacement('destroyer3', 'h', ['g6', 'i6']);
        shipPlacement.setPlacement('battleship4', 'v', ['f1', 'f4']);

        expect(shipPlacement.isFree(['e3', 'i3'])).toBeFalsy();
        expect(shipPlacement.isFree(['f5', 'f6'])).toBeTruthy();
    });

    test('Can clear ship placements', () => {
        shipPlacement.setPlacement('submarine3', 'v', ['h2', 'h4']);
        shipPlacement.setPlacement('destroyer3', 'h', ['g6', 'i6']);
        shipPlacement.setPlacement('battleship4', 'v', ['f1', 'f4']);
        shipPlacement.clear();

        expect(shipPlacement).toEqual({
            carrier5: null,
            battleship4: null,
            destroyer3: null,
            submarine3: null,
            patrol2: null,
        });
    });
});
