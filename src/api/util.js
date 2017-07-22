import axios from 'axios'
import { baseURL, timeout, withCredentials } from './config'

const api = axios.create({
  baseURL,
  timeout,
  // 跨域设置cookie相关
  withCredentials
})
/**
 * package of axios.get, include the handle of error
 * @param {string} url
 * @param {object} params
 */
export async function get (url, params) {
  try {
    return await api.get(url, params)
  } catch (e) {
    if (e.response) console.log(e.response)
    if (e.request) console.log(e.request)
    console.log(e.message)
  }
}

export async function post (url, params) {
  try {
    return await api.post(url, params)
  } catch (e) {
    if (e.response) console.log(e.response)
    if (e.request) console.log(e.request)
    console.log(e.message)
  }
}
