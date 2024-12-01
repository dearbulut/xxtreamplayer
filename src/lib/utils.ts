import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import {
  genSaltSync,
  hashSync,
  compareSync,
} from 'bcrypt-edge';


export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function hashPassword(password: string) {
  const salt = genSaltSync(10);
  return hashSync(password, salt);
}

export function checkPassword(password: string, hash: string) {
  return compareSync(password, hash);
}