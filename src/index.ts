import bodyParser from "body-parser";
import {blogsRouter} from './Blogs/1.0_blogsRouter';
import {postsRouter} from './Posts/1.0_postsRouter';
import {authRouter} from './Auth/1.0_authRouter';
import {usersRouter} from './Users/1.0_usersRouter';
import {commentsRouter} from './Comments/1.0_commentsRouter';
import {testingRouter} from './Testing/testingRouter';
import cookieParser from 'cookie-parser'
import {securityRouter} from './SecurityDevices/1.0_securityDevicesRouter';
import {app, startApp} from './settings';

const jsonBodyMiddleware = bodyParser.json()
app.use(jsonBodyMiddleware)
app.use(cookieParser())


app.set('trust proxy', true)
//прописываем наши роуты
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/auth', authRouter)
app.use('/testing', testingRouter)
app.use('/users', usersRouter)
app.use('/comments', commentsRouter)
app.use('/security', securityRouter)

startApp();

export default app
