import Kernel from './kernel'

const home = () => {
    const config = async () => await import('home/base')
    return { path: '/', config }
}

const contact = () => {
    const config = async () => await import('contact/base')
    return { path: '/contact', config }
}

const about = () => {
    const config = async () => await import('about/base')
    return { path: '/about', config }
}
let kernel = new Kernel(home, contact, about)


console.log(kernel.loaction)




