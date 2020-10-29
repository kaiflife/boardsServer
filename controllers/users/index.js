import {validateEmail, validateFullName, validatePassword, validateToken} from "../../helpers/validator";
import {errorLog} from "../../helpers/errorLog";
import {
    EMAIL_EXISTS,
    EMAIL_INSTRUCTIONS,
    FULL_NAME_INSTRUCTIONS, INVALID_TOKEN,
    PASSWORD_INSTRUCTIONS,
    SOMETHING_WENT_WRONG, USER_NOT_FOUND
} from "../../constants/errorStrings";
const { Users } = require('../../app');

module.exports = {
    auth(req, res) {
        const { email, password } = req;
        createToken({email, password, res})
         .then(res => res);
    },
    
    update(req, res) {
        
        const { fullName, email, password } = req;
        
        if(!validatePassword(password)) {
            return res.status(400).json(PASSWORD_INSTRUCTIONS);
        }
        if(validateFullName(fullName)) {
            return res.status(400).json(FULL_NAME_INSTRUCTIONS);
        }
        if(validateEmail(email)) {
            return res.status(400).json(EMAIL_INSTRUCTIONS);
        }
        
        const [ firstName, lastName ] = fullName.join(' ' );
        
        const id = validateToken(req.headers.authorization);
        
        const updatedData = {};
        if(firstName) updatedData.firstName = firstName;
        if(lastName) updatedData.lastName = lastName;
        if(password) updatedData.password = password;
        if(email) updatedData.email = email;
        
        Users.update(updatedData, {where: {id}})
         .then(() => res.send.status(200)).catch(e => {
             errorLog('update user', e);
             res.send.status(500).json(SOMETHING_WENT_WRONG);
        });
    },
    
    registration(req, res) {
        const { fullName, password, email } = req;
        const { err, payload } = validateToken(req.headers.authorization);
        if(err || !payload) {
            return res.send.status(401).json(INVALID_TOKEN);
        }
        
        if(!validatePassword(password)) {
            return res.status(400).json(PASSWORD_INSTRUCTIONS);
        }
        if(validateFullName(fullName)) {
            return res.status(400).json(FULL_NAME_INSTRUCTIONS);
        }
        if(validateEmail(email)) {
            return res.status(400).json(EMAIL_INSTRUCTIONS);
        }
        
        const [firstName, lastName] = fullName.join(' ');
        
        Users.findOne({where: {email}})
         .then(user => {
             if(user.email === email) {
                 return res.status(403).json(EMAIL_EXISTS);
             }
         }).catch(err=>console.log(err));
        
        Users.create({
            firstName,
            lastName,
            email,
            password,
        })
         .then( res => res.send.status(201))
         .catch( err => console.log(err));
    },
    
    delete(req, res) {
        const { password } = req;
        const userId = validateToken(req.headers.authorization);
        if(!userId) return res.send.status(401);
        
        Users.findOne({where: {id: userId}})
         .then(async user => {
             if(!user) {
                 res.send.status(401).json(USER_NOT_FOUND);
             }
             
             if(user.password === password) {
                 try {
                     const response = await Users.destroy({where: {id: userId}});
                     console.log(response);
                     return res.send.status.status(200);
                 } catch (e) {
                     errorLog('destroy user', e);
                     return res.send.status(500).json(SOMETHING_WENT_WRONG);
                 }
                 
             }
             
         })
    }
}


async function createToken ({email, password, res}) {
    return await Users.findOne({where: {email}})
     .then(user => {
         
         if(!user) {
             return res.send.status(404).json(USER_NOT_FOUND);
         }
         
         if(user.password !== password) {
             return res.send.status(401).json(USER_NOT_FOUND);
         }
         
         const head = Buffer.from(
          JSON.stringify({ alg: 'HS256', typ: 'jwt' })
         ).toString('base64')
         let body = Buffer.from(JSON.stringify(user)).toString(
          'base64'
         )
         const signature = crypto
          .createHmac('SHA256', process.env.AUTH_TOKEN)
          .update(`${head}.${body}`)
          .digest('base64')
         
         return res.status(200).json({
             id: user.id,
             login: user.login,
             token: `${head}.${body}.${signature}`,
         })
     }).catch( err => {
         console.error(err);
         return res.send.status(500).json(SOMETHING_WENT_WRONG)
     });
}