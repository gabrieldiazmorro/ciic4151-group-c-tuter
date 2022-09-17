from flask import Flask, request
from flask_cors import CORS
from flask_cors import cross_origin
from controller.user import BaseUser
from controller.time_slot import BaseTimeSlot
from controller.user_schedule import BaseUserSchedule
import json

app = Flask(__name__)

# app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://dhtadnktpvbkkc:e5cddd3894053e2ba0bf12f09f90aa4b8f5e04aeb5cc5b0e1b2c9e4edc006c56@ec2-52-200-5-135.compute-1.amazonaws.com:5432/ddeug3o0cq4ori'

@app.route('/')
def index():
    return "<h1>Hola Hovito<h1/>"

"""""""""""""MAIN ENTITY HANDLERS (CRUD Operations)"""""""""""""""

@app.route('/tuter/users', methods=['GET', 'POST'])
def handleUsers():
    if request.method == 'POST': #ADD
        return BaseUser().addNewUser(request.json)
    else:
        return BaseUser().getAllUsers() #Get list of all users

@app.route('/tuter/users/<int:uid>', methods=['GET', 'PUT', 'DELETE'])
def handleUsersbyId(uid):
    if request.method == 'GET':
        return BaseUser().getUserById(uid)
    elif request.method == 'PUT':
        return BaseUser().updateUser(uid, request.json)
    elif request.method == 'DELETE':
        return BaseUser().deleteUser(uid)

@app.route('/tuter/users/usernames', methods=['POST'])
def handleUsernames():
    if request.method == 'POST':
        return BaseUser().getRequestedIds(request.json)

@app.route('/tuter/user-schedule', methods=['GET', 'POST'])
def handleUserSchedules():
    if request.method == 'POST':
        return BaseUserSchedule().addNewUserSchedule(request.json)
    else:
        return BaseUserSchedule().getAllUserSchedules()

@app.route('/tuter/user-schedule/<int:usid>', methods=['GET', 'PUT', 'DELETE'])
def handleUserSchedulebyId(usid):
    if request.method == 'GET':
        return BaseUserSchedule().getUserScheduleById(usid)
    elif request.method == 'PUT':
        return BaseUserSchedule().updateUserSchedule(usid, request.json)
    elif request.method == 'DELETE':
        return BaseUserSchedule().deleteUserSchedule(usid)

@app.route('/tuter/user-schedule/markunavailable', methods=['POST'])
def handlemarkUserUnavailable():
    print(request.json)
    print(request.data)
    if request.json is not None:
        return BaseUserSchedule().addNewUserSchedule(request.json)
    else:
        return BaseUserSchedule().addNewUserSchedule(json.loads(request.data))

@app.route('/tuter/user-schedule/markavailable', methods=['POST'])
def handlemarkUserAvailable():
    return BaseUserSchedule().markAvailable(request.json)

@app.route('/tuter/timeslots', methods=['GET'])
def handleTimeSlots():
    return BaseTimeSlot().getAllTimeSlots()

@app.route('/tuter/timeslots/<int:tid>', methods=['GET'])
def handleTimeSlotbyId(tid):
    return BaseTimeSlot().getTimeSlotByTimeSlotId(tid)


"""""""""""""""""MAIN FUNCTION"""""""""""""""
if __name__ == '__main__':
    app.run(debug=True, port=8080, host="0.0.0.0")