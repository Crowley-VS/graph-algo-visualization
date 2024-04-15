export type QueueNode<T> = {
    value: T;
    priority: number;
};

export class PriorityQueue<T> {
    private heap: QueueNode<T>[];
    private nodePositions: Map<string, number>;
    private hasher: (value: T) => string;

    constructor(hasher: (value: T) => string) {
        this.heap = [];
        this.nodePositions = new Map();
        this.hasher = hasher;
    }

    private hash(value: T): string {
        return this.hasher(value);
    }

    private getParentIndex(i: number): number {
        return Math.floor((i - 1) / 2);
    }

    private getLeftChildIndex(i: number): number {
        return 2 * i + 1;
    }

    private getRightChildIndex(i: number): number {
        return 2 * i + 2;
    }

    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
        this.nodePositions.set(this.hash(this.heap[i].value), i);
        this.nodePositions.set(this.hash(this.heap[j].value), j);
    }

    public insert(node: QueueNode<T>): void {
        this.heap.push(node);
        this.nodePositions.set(this.hash(node.value), this.heap.length - 1);
        this.bubbleUp(this.heap.length - 1);
    }

    public extractMin(): QueueNode<T> | null {
        if (!this.heap.length) return null;
        if (this.heap.length === 1) {
            const min = this.heap.pop()!;
            this.nodePositions.delete(this.hash(min.value));
            return min;
        }
        const min = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.nodePositions.set(this.hash(this.heap[0].value), 0);
        this.nodePositions.delete(this.hash(min.value));
        this.bubbleDown(0);
        return min;
    }

    private bubbleUp(index: number): void {
        while (index !== 0 && this.heap[this.getParentIndex(index)].priority > this.heap[index].priority) {
            this.swap(index, this.getParentIndex(index));
            index = this.getParentIndex(index);
        }
    }

    private bubbleDown(index: number): void {
        let smallest = index;
        const leftChildIndex = this.getLeftChildIndex(index);
        const rightChildIndex = this.getRightChildIndex(index);

        if (leftChildIndex < this.heap.length && this.heap[leftChildIndex].priority < this.heap[smallest].priority) {
            smallest = leftChildIndex;
        }
        if (rightChildIndex < this.heap.length && this.heap[rightChildIndex].priority < this.heap[smallest].priority) {
            smallest = rightChildIndex;
        }
        if (smallest !== index) {
            this.swap(index, smallest);
            this.bubbleDown(smallest);
        }
    }

    public update(value: T, newPriority: number): void {
        let index = this.nodePositions.get(this.hash(value));
        if (index === undefined) return;

        let oldPriority = this.heap[index].priority;
        this.heap[index].priority = newPriority;
        if (newPriority < oldPriority) {
            this.bubbleUp(index);
        } else {
            this.bubbleDown(index);
        }
    }

    public get length(): number {
        return this.heap.length;
    }

    public contains(value: T): boolean {
        return this.nodePositions.has(this.hash(value));
    }
}
