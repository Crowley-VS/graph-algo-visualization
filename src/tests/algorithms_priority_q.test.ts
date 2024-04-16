import { PriorityQueue } from '../algorithms/priority_queue';

describe('PriorityQueue', () => {
    let pq: PriorityQueue<string>;
    let pqNum: PriorityQueue<number>;

    beforeEach(() => {
        // Initializing the priority queue for strings with a simple string hasher
        pq = new PriorityQueue<string>((value: string) => value);

        // Initializing the priority queue for numbers where numbers are converted to strings
        pqNum = new PriorityQueue<number>((value: number) => value.toString());
    });
    test('should start empty', () => {
        expect(pq.extractMin()).toBeNull();
    });

    test('should insert elements and maintain heap order with strings', () => {
        pq.insert({ value: 'task3', priority: 5 });
        pq.insert({ value: 'task1', priority: 10 });
        pq.insert({ value: 'task2', priority: 15 });
        expect(pq.extractMin()).toEqual({ value: 'task3', priority: 5 });
    });

    test('should handle extraction correctly with strings', () => {
        pq.insert({ value: 'task1', priority: 10 });
        pq.insert({ value: 'task2', priority: 15 });
        pq.insert({ value: 'task3', priority: 5 });
        expect(pq.extractMin()).toEqual({ value: 'task3', priority: 5 });
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 10 });
        expect(pq.extractMin()).toEqual({ value: 'task2', priority: 15 });
        expect(pq.extractMin()).toBeNull();
    });

    test('should insert elements and maintain heap order with numbers', () => {
        pqNum.insert({ value: 3, priority: 5 });
        pqNum.insert({ value: 1, priority: 10 });
        pqNum.insert({ value: 2, priority: 15 });
        expect(pqNum.extractMin()).toEqual({ value: 3, priority: 5 });
    });

    test('should handle extraction correctly with numbers', () => {
        pqNum.insert({ value: 1, priority: 10 });
        pqNum.insert({ value: 2, priority: 15 });
        pqNum.insert({ value: 3, priority: 5 });
        expect(pqNum.extractMin()).toEqual({ value: 3, priority: 5 });
        expect(pqNum.extractMin()).toEqual({ value: 1, priority: 10 });
        expect(pqNum.extractMin()).toEqual({ value: 2, priority: 15 });
        expect(pqNum.extractMin()).toBeNull();
    });

    test('should update priorities correctly with strings', () => {
        pq.insert({ value: 'task1', priority: 10 });
        pq.insert({ value: 'task2', priority: 15 });
        pq.insert({ value: 'task3', priority: 5 });
        pq.update('task1', 2);
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 2 });
        pq.update('task2', 1);
        expect(pq.extractMin()).toEqual({ value: 'task2', priority: 1 });
    });

    test('should handle extensive mixed operations', () => {
        for (let i = 0; i < 20; i++) {
            pq.insert({ value: `task${i}`, priority: Math.floor(Math.random() * 100) });
        }
        for (let i = 0; i < 10; i++) {
            const newPriority = Math.floor(Math.random() * 100);
            pq.update(`task${i}`, newPriority);
        }
        let current = pq.extractMin()!;
        let next = pq.extractMin();
        while (next !== null) {
            expect(current.priority).toBeLessThanOrEqual(next.priority);
            current = next;
            next = pq.extractMin();
        }
    });

    test('should properly handle priority updates that do not change order', () => {
        pq.insert({ value: 'task1', priority: 10 });
        pq.insert({ value: 'task2', priority: 15 });
        pq.insert({ value: 'task3', priority: 20 });
        pq.update('task2', 15); // Priority remains the same
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 10 });
        expect(pq.extractMin()).toEqual({ value: 'task2', priority: 15 });
        expect(pq.extractMin()).toEqual({ value: 'task3', priority: 20 });
    });

    test('should handle non-existent updates gracefully', () => {
        pq.insert({ value: 'task1', priority: 10 });
        pq.update('task4', 3); // non-existent
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 10 });
    });
});
