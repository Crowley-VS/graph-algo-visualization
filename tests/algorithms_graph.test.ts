import { PriorityQueue } from '../algorithms/priority_queue'; // Adjust the import path as necessary

describe('PriorityQueue', () => {
    let pq: PriorityQueue;

    beforeEach(() => {
        pq = new PriorityQueue();
    });

    test('should start empty', () => {
        expect(pq.extractMin()).toBeNull();
    });

    test('should insert elements and maintain heap order', () => {
        pq.insert({ value: 'task3', priority: 5 });
        pq.insert({ value: 'task1', priority: 10 });
        pq.insert({ value: 'task2', priority: 15 });
        expect(pq.extractMin()).toEqual({ value: 'task3', priority: 5 });
    });

    test('should handle extraction correctly', () => {
        pq.insert({ value: 'task1', priority: 10 });
        pq.insert({ value: 'task2', priority: 15 });
        pq.insert({ value: 'task3', priority: 5 });
        expect(pq.extractMin()).toEqual({ value: 'task3', priority: 5 });
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 10 });
        expect(pq.extractMin()).toEqual({ value: 'task2', priority: 15 });
        expect(pq.extractMin()).toBeNull();
    });

    test('should update priorities correctly', () => {
        pq.insert({ value: 'task1', priority: 10 });
        pq.insert({ value: 'task2', priority: 15 });
        pq.insert({ value: 'task3', priority: 5 });
        pq.update('task1', 2);
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 2 });
        pq.update('task2', 1);
        expect(pq.extractMin()).toEqual({ value: 'task2', priority: 1 });
    });

    test('should handle non-existent updates gracefully', () => {
        pq.insert({ value: 'task1', priority: 10 });
        pq.update('task4', 3); // non-existent
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 10 });
    });

    test('should handle duplicate priorities correctly', () => {
        pq.insert({ value: 'task1', priority: 5 });
        pq.insert({ value: 'task2', priority: 5 });
        expect(pq.extractMin()).toEqual({ value: 'task1', priority: 5 });
        expect(pq.extractMin()).toEqual({ value: 'task2', priority: 5 });
    });

    test('should maintain correct order with large number of elements', () => {
        const nodes = [];
        for (let i = 1000; i >= 1; i--) {
            nodes.push({ value: `task${i}`, priority: i });
        }
        nodes.forEach(node => pq.insert(node));
        for (let i = 1; i <= 1000; i++) {
            expect(pq.extractMin()).toEqual({ value: `task${i}`, priority: i });
        }
    });

    test('should handle extensive mixed operations', () => {
        // Insert a series of nodes
        for (let i = 0; i < 20; i++) {
            pq.insert({ value: `task${i}`, priority: Math.floor(Math.random() * 100) });
        }

        // Update some nodes randomly
        for (let i = 0; i < 10; i++) {
            const newPriority = Math.floor(Math.random() * 100);
            pq.update(`task${i}`, newPriority);
        }

        // Extract min to ensure the queue's integrity
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
