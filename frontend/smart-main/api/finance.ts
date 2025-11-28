import { BASES, get, post } from './http';

export async function listLoanTypes() {
  return get('/financing/loan-types', BASES.FINANCE);
}

export async function loanTypeDetail(id: number) {
  return get(`/financing/loan-types/${id}`, BASES.FINANCE);
}

export async function createApplication(body: any) {
  return post('/farmer/financing/applications', body, BASES.FINANCE);
}

export async function myApplications() {
  return get('/farmer/financing/applications', BASES.FINANCE);
}

export async function bankerList(status = 2) {
  return get(`/bank/financing/applications?status=${status}`, BASES.FINANCE);
}

export async function bankerDetail(id: number) {
  return get(`/bank/financing/applications/${id}`, BASES.FINANCE);
}

export async function bankerReview(id: number, body: any) {
  return post(`/bank/financing/applications/${id}/review`, body, BASES.FINANCE);
}

