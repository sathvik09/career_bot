const Discord = require('discord.js');
const bot = new Discord.Client();
const mongoose = require('mongoose');
const { Db } = require('mongodb');

var accountSid = 'ACd8eb1c84bbe4a0275a6a463df31cd566';
var authToken = process.env.twillio_token;
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

mongoose.connect(process.env.mongo, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  });

var Schema=mongoose.Schema;

const MentorSchema = new mongoose.Schema({
    name : {
        type : String
    },
    field :{
        type : String
    },
    about_mentor : {
        type: String
    },
    contact : {
        type: String
    }
});

const Mentor = mongoose.model('Mentor', MentorSchema);



const FieldSchema = new mongoose.Schema({
    field_name : {
        type : String
    },
    field_bio :{
        type : String
    },
    mentors : {
        type: String
    }
});
const Field = mongoose.model('Field', FieldSchema);

const prefix = '$';
bot.login(process.env.token);

const exampleEmbed = new Discord.MessageEmbed()
	.setColor('#0099ff')
	.setTitle('Indian Career League')
	.setURL('https://discord.js.org/')
	.setDescription(`Hi! Let's explore some possibilities today. But first, are you in for a surprise?`)
	.setThumbnail('https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png')
	.addFields(
		{ name: '$field', value: 'Fields available' },
		{ name: '$field {field_name}', value: 'Data about a particular field name'},
		{ name: '$mentor {mentor_name}', value: 'Data about a particular mentor'},
		{ name: '$surprise', value: 'gives trending/random field'},
        { name: '$contact_us', value: 'connect with us via email'},		
	)
	//.addField('Inline field title', 'Some value here', true)
	.setTimestamp()
	.setFooter('With love from career bot x3', 'https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png');

    let ques = `
    1. How would your friends describe you?
    a. Creative
    b. Friendly
    c. Smart
    
    
    2. Pick One
    a.Work Hard
    b.Work Fast
    c.Work Smart
    
    3. Pick One
    a.Art
    b.Math/Science
    c.History
    
    4. Which movie genre do you like the most
    a.Action/Horror/Adventure
    b.Comedy/Inspirational/Romance
    c.History/Political/Documentary
    
    
    5. Which of these activities do you enjoy the most
    a.Exercise
    b.Movies/Music
    c.Reading
    
    6. Who would you join at a social event
    a.Small group having a lively discussion
    b.Large group that is laughing a lot
    c.Several people playing a game
    
    7. Pick One
    a.Agility
    b.Strength
    c.Dexterity
    
    
    8. Which of these activities do you enjoy the most
    a.Economy
    b.Health
    c.Education 
       
    9.Which one are you?
    a.Extrovert
    b.Introvert
    c.Mixed

    10.Your style of thinking is?
    a.Quick Thinker
    b.Creative Thinker
    c.Logical
    `;

bot.on('message',msg=>{
    let args = msg.content.substring(prefix.length).split(" ");
    if(msg.content==='hie'){
        let emb = Discord.Rich
        msg.reply("hello there");
    }
      
        switch(args[0]){
            case 'help':msg.channel.send(exampleEmbed);
                        break;
            case 'field': if(!args[1]){
                            let x =  [
                                    ['Software_Dev','1'],
                                    ['Business','2'],
                                    ['Architecture','3'],
                                    ['Sports','4'], 
                                    ['Aerospace','5'],
                                    ['Entrepreneurs','6'],
                                    ['Lawyer','7'],
                                    ['Fashion_Designer','8'] ,
                                    ['Hotel_Management','9'],
                                    ['Journalism','10'] 
                                    ];
                            msg.channel.send(field(x,"Fields"));
                        }
                        else{
                            console.log(args[1]);
                                    Field.find({field_name:args[1]},function(err,found){
                                        if(!err){
                                        
                                    msg.channel.send(details((found[0].field_bio),(found[0].mentors),args[1]));
                                        }
                                })
                            }
                        break; 
                        
                        case 'mentor': if(!args[1]){
                            msg.reply("Write the mentor name with the command")
                        }
                        else{
                                    Mentor.find({name:args[1]},function(err,found){
                                        if(!err){
                                        console.log(found);
                                        
                                    msg.channel.send(mentlist((found[0].about_mentor),(found[0].field),(found[0].contact),args[1]));
                                        }
                                        else
                                        console.log(err);
                                        
                                })
                            }
                        break;  
                        case 'surprise' : //db connect ro gert the qs i n let questiom[]
                                          msg.reply(ques);
                                          bot.on('message',mess=>{
                                            let arg = mess.content.substring(prefix.length).split(" ");
                                            if(msg.content==='hie'){
                                                let emb = Discord.Rich
                                                msg.reply("hello there");
                                            }
                                              if('answer' === arg[0]){
                                                 let answer = arg[1];
                                                 let sum=0;
                                                 for(let x=0;x<answer.length;x++){
                                                     if(answer.charAt(x) == 'b'){
                                                         sum+=10
                                                     }
                                                     if(answer.charAt(x) == 'c'){
                                                         sum+=20;
                                                     }
                                                 }
                                                 console.log(sum);
                                                 if(sum<=50){
                                                    let str = `
                                                    The guider
                                                    You are accepted everywhere. 
                                                    People love you because you are a good listener and communicator. You are knowledgable and have an intuitive sense
                                                    of empathy for other beings.
                                                    Your career options can be: Journalism, Hotel Management, Market Research Analyst, 
                                                    Public Relations, Teacher, Nurse, Therapist and Police Officer.
                                                            `
                                                    msg.reply(str);
                                                 }
                                                 else if(sum<=100){
                                                    let str = `
                                                    The Artist
                                                    You are happy to be who you are. 
                                                    You live in a colourful, sensual world. Creativity inspires you. You have the hardest time planning
                                                    a future, finding constructive ideals to base your goals is difficult.
                                                    You are spontaneous and unpredictable.
                                                    Your career options can be: Fashion Design, Architecture, Actor/Entertainer, Interior designor, Writer,
                                                    Photographer, Editor.
                                                            `
                                                    msg.reply(str);

                                                 }
                                                 else if(sum<=150){
                                                    let str = `
                                                    The leader
                                                    You are special, you will shine in any career you pursue
                                                    You are charismatic and confident. You can draw crowds towards a common goal.
                                                    If there is anything you love, it is a good challenge. You firmly believe that given enough time 
                                                    and resources,you can achieve any goal!
                                                    Your career options can be: President, Project manage, Lawyer, Automative engineer,
                                                    Financial advisor, Entrepreneur.
                                                            `
                                                    msg.reply(str);

                                                  }
                                                 else if(sum<=200){
                                                     let str = `
                                                     You are a genius and it shows!
                                                    You enjoy theoretical and abstract concepts. You dislike confusion, disorganized environments and
                                                     inefficiency. Usually you are reserved and prefer solitary work to groups. You are always working for
                                                      a better future. You were very analytical and logical.
                                                    Your career options can be: Scientist, Software Developer, Pilot, Doctor, Aircraft mechanic,
                                                     Historian, Pharmacy mechanic.
                                                     `
                                                     msg.reply(str);

                                                 }
                                                 
                                              }
                                          })
                                          break;
                               case 'contact_us' : msg.reply("you can contact us on ska.agrawal5@gmail.com !");
                                                   break;
                               case 'refer_a_friend' : if(!args[1]){
                                                         msg.reply("Enter a valid Phone no !");
                                                         break;
                                                       }
                                                       else{
                                                           sms(args[1]);
                                                           msg.reply("Invite sent!");
                                                           break;
                                                       }                                         
                        }
                               
                                
})
bot.on('ready',()=>{
    console.log("This bot is alive");
})


let field = (x,desc)=>{
    
let Embed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle('Indian Career League')
.setURL('https://discord.js.org/')
.setDescription(desc)
.setThumbnail('https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png')
//.addField('Inline field title', 'Some value here', true)
.setTimestamp()
.setFooter('with love from career bot', 'https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png')

    x.forEach(e => {
        console.log(e[1]);
        Embed.addFields({name:e[1],value:e[0]})
    });

    return Embed;
}

let details=(x,y,desc)=>{
    
let Embed = new Discord.MessageEmbed()
.setColor('#0099ff')
.setTitle(desc)
.setURL('https://discord.js.org/')
.setDescription("Mentors: "+y)
.setThumbnail('https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png')
//.addField('Inline field title', 'Some value here', true)
.setTimestamp()
.setFooter('with love from career bot', 'https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png')
 
  
        Embed.addFields({name:"About The Field",value:x});
    
    return Embed;
}


let mentlist = (aboutMen,field1,contact,name)=>{
        let Embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle(name)
        .setURL('https://discord.js.org/')
        .setDescription(aboutMen)
        .setThumbnail('https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png')
        //.addField('Inline field title', 'Some value here', true)
        .setTimestamp()
        .setFooter('with love from career bot', 'https://cdn.discordapp.com/attachments/677209271330537483/736749786983694447/icl_logo_2607.png')
    
    
            Embed.addFields({name:field1,value:contact});
    
    return Embed;
}

let sms = (no)=>{
    no = `+91${no}`;
    client.messages
    .create({
       body: 'Hey Join our discord chat for some amazing career updates!!',
       from: '+15155237590',
       to: no
     })
    .then(message => console.log(message.sid));
}
