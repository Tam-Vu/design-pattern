import { Observer } from './observer.interface';

export interface Subject {
  observers: Observer[];
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(): void;
}
