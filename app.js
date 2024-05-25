import express from 'express'
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();
const app = express();
app.use(express.json());


/*********** AUTHENTICATE TOKEN ***********/

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
  
    if (token == null) {
      return res.sendStatus(401);
    }
  
    jwt.verify(token, process.env.SECRETY_TOKEN, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }
      req.user = user;
      next();
    });
  }

/*********** AUTH ***********/

//LOGIN
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
      // Procurar o usuário pelo email
      const user = await prisma.user.findUnique({
        where: { email }
      });
  
      // Verificar se o usuário existe
      if (!user) {
        return res.status(404).json({ error: 'Usuário não encontrado' });
      }
  
      // Verificar a senha
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }
  
      // Gerar o token de autenticação
      const token = jwt.sign({ userId: user.id }, process.env.SECRETY_TOKEN, { expiresIn: '1h' });
  
      // Retornar o token
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
/*********** USERS ***********/

//CREATE
app.post('/user/add', async (req, res)=>{
    const { email, name, password, level, status } = req.body;

    //gerar um hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    //criar o usuário
    try{
        const newUser = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                level,
                status
            }
        });

        //retorna os dados do usuário criado
        res.status(201).json(newUser);
    }catch(err){
        res.status(400).json({ error: err.message })
    }
})

//LIST ALL
app.get('/user/list', authenticateToken, async (req, res)=>{
    //lista todos os usuários
    const users = await prisma.user.findMany();
    res.status(200).json(users);
})

//UPDATE
app.put('/user/update/:id', authenticateToken, async (req, res)=>{
    const { email, name, password, level, status } = req.body;

    //gera um hash para a senha
    const hashedPassword = await bcrypt.hash(password, 10);
    try{
        //atualiza o usuário
        const updateUser = await prisma.user.update({
            where: {
                id: req.params.id
            },
            data: {
                email,
                name,
                password: hashedPassword,
                level,
                status
            }
        });

        res.status(201).json(updateUser);
    }catch(err){
        res.status(400).json({ error: err.message })
    }
})

//DELETE
app.delete('/user/delete/:id', authenticateToken, async (req, res)=>{
    
    try{
        //deleta o usuário
        await prisma.user.delete({
            where: {
                id: req.params.id
            }
        });

        res.status(201).json('Deletado com sucesso!');
    }catch(err){
        res.status(400).json({ error: err.message })
    }
})

/*********** EXPENSES ***********/

//CREATE
app.post('/expense/add', authenticateToken, async (req, res)=>{
    const { name, price, status, dueDate } = req.body;
    try{
        //cria uma nova dispesa
        const newExpense = await prisma.expense.create({
            data: {
                name,
                price,
                status,
                dueDate: new Date(dueDate)
            }
        });

        //retorna os dados da dispesa
        res.status(201).json(newExpense);
    }catch(err){
        res.status(400).json({ error: err.message })
    }
})

//LIST ALL
app.get('/expense/list', authenticateToken, async (req, res)=>{
    //lista todas as dispesas
    const expenses = await prisma.expense.findMany();
    res.status(200).json(expenses);
})

//UPDATE
app.put('/expense/update/:id', authenticateToken, async (req, res)=>{
    const { name, price, status, dueDate } = req.body;
    try{
        //atualiza a dispesa
        const updateExpense = await prisma.expense.update({
            where: {
                id: req.params.id
            },
            data: {
                name,
                price,
                status,
                dueDate: new Date(dueDate)
            }
        });

        //retorna os dados atualizado
        res.status(201).json(updateExpense);
    }catch(err){
        res.status(400).json({ error: err.message })
    }
})

//DELETE
app.delete('/expense/delete/:id', authenticateToken, async (req, res)=>{
    
    try{
        //deleta uma dispesa
        await prisma.expense.delete({
            where: {
                id: req.params.id
            }
        });

        res.status(201).json('Deletado com sucesso!');
    }catch(err){
        res.status(400).json({ error: err.message })
    }
})

app.get('/', (req, res) => {
    res.send('<img style="width: 100%; height: 100%; object-fit: cover; position: absolute; top:0; left:0;" src="https://support.discord.com/hc/en-us/article_attachments/206303208/eJwVyksOwiAQANC7sJfp8Ke7Lt15A0MoUpJWGmZcGe-ubl_eW7zGLmaxMZ80A6yNch-rJO4j1SJr73Uv6Wwkcz8gMae8HeXJBOjC5NEap42dokUX_4SotI8GVfBaYYDldr3n3y_jomRtD_H5ArCeI9g.zGz1JSL-9DXgpkX_SkmMDM8NWGg.gif" alt="api"/>');
});


/*********** ERROR ROUTE ***********/
app.get('/error', (req, res) => {
    throw new Error('Route not found');
});

/*********** 404 ROUTE ***********/
// Middleware para capturar rotas inexistentes e responder com 404
app.use((req, res, next) => {
    res.status(404).json({ message: 'Route not found' });
});

/*********** ERROR HANDLING MIDDLEWARE ***********/
// Middleware de erro global
function errorHandler(err, req, res, next) {
    console.error(err.stack);

    if (res.headersSent) {
        return next(err);
    }

    const status = err.status || 500;
    const message = err.message || 'Ocorreu um erro interno no servidor';

    res.status(status).json({ message });
}

app.use(errorHandler);

app.listen(3000);