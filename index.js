const fastify = require('fastify')({
    logger: true
})

const sequelize = require('sequelize')
const db = new sequelize.Sequelize('postgresql://postgres.dggkiyxpocrrrrkbuttw:t0P87YhS2SHqkRGN@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres')

const Task = db.define('task',{
    id: {
        type : sequelize.DataTypes.UUIDV4,
        primaryKey: true,
        defaultValue: sequelize.DataTypes.UUIDV4,

    },
    description: sequelize.DataTypes.STRING,
    isCompleted: {
        type : sequelize.DataTypes.BOOLEAN,
        defaultValue: false,
        field: 'is_completed',
    },
},{ tableName : 'task', timestamps : false});


const taskModel = []

fastify.route({
    method: 'GET',
    url: '/',
    handler: function (request,response){
        return { hello: 'world'}
    }
})

fastify.route({
    method: 'GET',
    url: '/tasks',
    handler: async function (request,response){
        const tasks = await Task.findAll()
        return { 
            data: tasks,
            count: tasks.length
        }
    }
})

fastify.route({
    method: 'GET',
    url: '/tasks/:id',
    handler: function (request,response){
        const task = taskModel.find((task)=> task.id === Number(request.params.id) )

        if(task == undefined){
            return response.status(404).send({
                message: 'task is not found'
            })
        }
        return { 
            data: {
                id : task
            }
        }
    }
})

fastify.route({
    method: 'POST',
    url: '/tasks',
    handler: function (request,response){
        const description = request.body.description
        const isCompleted = false

        taskModel.push({
            id:1,
            description: description,
            isCompleted: isCompleted,
        })

        return { 
            data: {
                id:1,
                description: description,
                isCompleted: isCompleted,
            }
        }
    }
})

fastify.route({
    method: 'PUT',
    url: '/tasks/:id',
    handler: function (request,response){
        const task = taskModel.find((task)=> task.id === Number(request.params.id) );

        if (task ===undefined){
            return response.status(404).send({
                message: "task is not found",
            });
        }

        task.description = request.body.description || task.description
        task.isCompleted = request.body.isCompleted || task.isCompleted

        return response.status(200).send({data: task })

    }
})

fastify.route({
    method: 'DELETE',
    url: '/tasks/:id',
    handler: function (request,response){
        const index = taskModel.findIndex((task)=> task.id === Number(request.params.id));

        if(index !== -1) {
            taskModel.splice(index,1);
        }
        return response.status(204).send({
            message: "deleted"
        })
    }
})

async function start(){
    fastify.listen({
        port: 3000,
        host: '0.0.0.0'
    })
    await db.authenticate()
    console.log('connect to database')
}

start().then(() => { console.log('server start at 3000')})