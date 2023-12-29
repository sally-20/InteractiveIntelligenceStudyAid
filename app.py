from dotenv import load_dotenv
load_dotenv()
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_login import LoginManager, UserMixin, login_user, login_required, current_user, AnonymousUserMixin
from flask_wtf import FlaskForm
from jinja2 import TemplateNotFound
from wtforms import StringField, PasswordField, SubmitField, validators, ValidationError
from wtforms.validators import DataRequired, Email, EqualTo
from pymongo import MongoClient
from datetime import datetime
from flask.helpers import send_from_directory
from werkzeug.utils import secure_filename
from werkzeug.security import generate_password_hash, check_password_hash
import os
import openai

app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('FLASK_SECRET_KEY')
app.config['UPLOAD_FOLDER'] = 'knowledge'
app.config['SESSION_COOKIE_SECURE'] = True
app.config['SESSION_COOKIE_HTTPONLY'] = True
openai.api_key = os.environ.get('OPENAI_API_KEY')
login_manager = LoginManager(app)
login_manager.login_view = 'login'
login_manager.anonymous_user = AnonymousUserMixin

#from flask_talisman import Talisman
#talisman = Talisman(app)

# MongoDB configuration
client = MongoClient(os.environ.get('DATABASE_URI'), ssl=True)
db = client['iisa']
users_collection = db['users']
feedback_collection = db['feedback']

# Define the user model
class User(UserMixin):
    def __init__(self, username, email, password):
        self.username = username
        self.email = email
        self.password = password

    def get_id(self):
        # Return a unique identifier for the user.
        return self.username

# Define the forgot password form
class ForgotPasswordForm(FlaskForm):
    username = StringField('Username', validators=[validators.DataRequired()])
    email = StringField('Email', validators=[validators.DataRequired(), validators.Email()])
    new_password = PasswordField('New Password', validators=[validators.DataRequired()])
    confirm_new_password = PasswordField('Confirm New Password', validators=[validators.DataRequired(), validators.EqualTo('new_password', message='Passwords must match')])
    submit = SubmitField('Reset Password')

@login_manager.user_loader
def load_user(username):
    user_data = users_collection.find_one({'username': username})
    if user_data:
        return User(username=user_data['username'], email=user_data['email'], password=user_data['password'])
    return None

# Define the signup form
class SignupForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[DataRequired()])
    password2 = PasswordField('Confirm Password', validators=[DataRequired(), EqualTo('password')])
    submit = SubmitField('Sign Up')

    def validate_username(self, field):
        if users_collection.find_one({'username': field.data}):
            raise ValidationError('Username is already in use.')

    def validate_email(self, field):
        if users_collection.find_one({'email': field.data}):
            raise ValidationError('Email is already in use.')

# Define the login form
class LoginForm(FlaskForm):
    username_or_email = StringField('Username or Email', validators=[DataRequired()])
    password = PasswordField('Password', validators=[DataRequired()])
    submit = SubmitField('Login')

app.config['ALLOWED_EXTENSIONS'] = {'txt', 'pdf', 'csv'}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']

def initialize_messages() -> list:
    """Initialize the chat messages with system and user messages."""
    return [
        {"role": "system", "content": "You’re a kind helpful assistant, who only responds with the knowledge you know for sure, don't hallucinate information."},
        {"role": "user", "content": "Your only knowledge is about the subjects algorithms, personal finance, and calculus "}
    ]

def generate_chat_response(user_input):
    try:
        messages = initialize_messages()
        messages.append({"role": "user", "content": user_input})
        completion = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages
        )
        return completion['choices'][0]['message']['content']
    except Exception as e:
        print(f"Error calling OpenAI API: {e}")

    # Save the updated completed_lessons data structure to your database
    # This step depends on your specific implementation
    # For simplicity, let's assume you're using a dictionary for now
    # You would replace this with actual database updates in a real application

    # For example, if using MongoDB:
    # db['completed_lessons'].update_one({'username': username}, {'$set': {'completed_lessons': completed_lessons}}, upsert=True)

    # Or if using a simple file-based approach:
    # with open('completed_lessons.json', 'w') as file:
    #     json.dump(completed_lessons, file)

    # Save the evaluation result to the user's profile in the database
    # This step depends on your specific implementation
    # For simplicity, let's assume you're using a dictionary for now
    # You would replace this with actual database updates in a real application

    # For example, if using MongoDB:
    # db['users'].update_one({'username': username}, {'$set': {'evaluations': evaluation_result}}, upsert=True)


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('index.html#about')

@app.route('/signup', methods=['GET', 'POST'])
def signup():
    form = SignupForm()
    if form.validate_on_submit():
        user = User(form.username.data, form.email.data, form.password.data)
        users_collection.insert_one({'username': user.username, 'email': user.email, 'password': user.password})
        flash('Account created successfully. Please log in.', 'success')
        return redirect(url_for('login'))
    return render_template('signup.html', form=form)

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        username_or_email_input = form.username_or_email.data
        password_input = form.password.data
        if '@' in username_or_email_input:
            user = load_user(users_collection.find_one({'email': username_or_email_input})['username'])
        else:
            user = load_user(username_or_email_input)
        if user and check_password_hash(user.password, password_input):
            flash('Login successful!', 'success')
            login_user(user)
            if user.username == 'admin':
                return redirect(url_for('dashboard'))
            next_page = request.args.get('next')
            return redirect(next_page or url_for('algorithms'))
        else:
            flash('Invalid username or password. Please try again.', 'danger')
    return render_template('login.html', form=form)

@login_manager.user_loader
def load_user(username):
    user_data = users_collection.find_one({'username': username})
    if user_data:
        return User(username=user_data['username'], email=user_data['email'], password=user_data['password'])
    return None

@app.route('/forgot_password', methods=['GET', 'POST'])
def forgot_password():
    form = ForgotPasswordForm()
    if form.validate_on_submit():
        username_input = form.username.data
        email_input = form.email.data
        new_password_input = form.new_password.data
        # Implement the logic to reset the password here
        # Retrieve the user from the database using username_input and email_input
        user = users_collection.find_one({'username': username_input, 'email': email_input})
        if user:
            # Update the user's password in the database
            users_collection.update_one({'username': username_input, 'email': email_input}, {'$set': {'password': generate_password_hash(new_password_input)}})
            flash('Password reset successful. Please log in with your new password.', 'success')
            return redirect(url_for('login'))
        else:
            flash('Invalid username or email. Please try again.', 'danger')
    return render_template('forgot_password.html', form=form)

@app.route('/knowledge/<path:filename>')
def serve_knowledge_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        user_input = request.get_json()['user_input']
        print(f'Received user input: {user_input}')
    except KeyError:
        return jsonify({'error': 'Missing user_input parameter'}), 400
    response = generate_chat_response(user_input)
    return jsonify({'response': response})

# Declare lesson_urls as a global variable outside of any function
lesson_urls = {}

@login_required
@app.route('/algorithms', methods=['GET', 'POST'])
def algorithms():
    # Use the global keyword to modify the lesson_urls variable
    global lesson_urls

    # Define the ranges for each category
    beglsn_range = range(1, 21)  # 1 to 20
    itdlsn_range = range(1, 17)  # 1 to 16
    advlsn_range = range(1, 41)  # 1 to 40

    # Generate URLs for each category
    for i in beglsn_range:
        lesson_name = f"algbeglsn{i}"
        lesson_urls[lesson_name] = f'/algorithms/{lesson_name}'

    for i in itdlsn_range:
        lesson_name = f"algitdlsn{i}"
        lesson_urls[lesson_name] = f'/algorithms/{lesson_name}'

    for i in advlsn_range:
        lesson_name = f"algadvlsn{i}"
        lesson_urls[lesson_name] = f'/algorithms/{lesson_name}'

    if request.method == 'POST':
        user_input = request.form['user_input']
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                user_input += f' Uploaded file: {filename}'
        return render_template('algorithmslearning.html', chat_response=generate_chat_response(user_input), lesson_urls=lesson_urls)
    return render_template('algorithmslearning.html', lesson_urls=lesson_urls)

@app.route('/algorithm_lesson/<lesson_name>')
def algorithm_lesson(lesson_name):
    # Construct the path to the HTML file based on the lesson name
    lesson_html_file = f"lessons/{lesson_name}.html"
    try:
        return render_template(lesson_html_file, lesson_name=lesson_name)
    except TemplateNotFound:
        return render_template("lesson_not_found.html")

@login_required
@app.route('/personalfinance', methods=['GET', 'POST'])
def personalfinance():
    # Use the global keyword to modify the lesson_urls variable
    global lesson_urls

    # Define the ranges for each category
    beglsn_range = range(1, 12)  # 1 to 11
    itdlsn_range = range(1, 45)  # 1 to 44
    advlsn_range = range(1, 49)  # 1 to 48

    # Generate URLs for each category
    for i in beglsn_range:
        lesson_name = f"pfbeglsn{i}"
        lesson_urls[lesson_name] = f'/personalfinance/{lesson_name}'

    for i in itdlsn_range:
        lesson_name = f"pfitdlsn{i}"
        lesson_urls[lesson_name] = f'/personalfinance/{lesson_name}'

    for i in advlsn_range:
        lesson_name = f"pfadvlsn{i}"
        lesson_urls[lesson_name] = f'/personalfinance/{lesson_name}'
    
    if request.method == 'POST':
        user_input = request.form['user_input']
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                user_input += f' Uploaded file: {filename}'
        return render_template('personalfinancelearning.html', chat_response=generate_chat_response(user_input))
    return render_template('personalfinancelearning.html')

@app.route('/personalfinance_lesson/<lesson_name>')
def personalfinance_lesson(lesson_name):
    # Construct the path to the HTML file based on the lesson name
    lesson_html_file = f"lessons/{lesson_name}.html"
    try:
        return render_template(lesson_html_file, lesson_name=lesson_name)
    except TemplateNotFound:
        return render_template("lesson_not_found.html")

@login_required
@app.route('/calculus', methods=['GET', 'POST'])
def calculus():
    # Use the global keyword to modify the lesson_urls variable
    global lesson_urls

    # Define the ranges for each category
    beglsn_range = range(1, 9)  # 1 to 8
    itdlsn_range = range(1, 7)  # 1 to 6
    advlsn_range = range(1, 9)  # 1 to 8

    # Generate URLs for each category
    for i in beglsn_range:
        lesson_name = f"calbeglsn{i}"
        lesson_urls[lesson_name] = f'/calculus/{lesson_name}'

    for i in itdlsn_range:
        lesson_name = f"calitdlsn{i}"
        lesson_urls[lesson_name] = f'/calculus/{lesson_name}'

    for i in advlsn_range:
        lesson_name = f"caladvlsn{i}"
        lesson_urls[lesson_name] = f'/calculus/{lesson_name}'
    
    if request.method == 'POST':
        user_input = request.form['user_input']
        if 'file' in request.files:
            file = request.files['file']
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                user_input += f' Uploaded file: {filename}'
        return render_template('calculuslearning.html', chat_response=generate_chat_response(user_input))
    return render_template('calculuslearning.html')

@app.route('/calculus_lesson/<lesson_name>')
def calculus_lesson(lesson_name):
    # Construct the path to the HTML file based on the lesson name
    lesson_html_file = f"lessons/{lesson_name}.html"
    try:
        return render_template(lesson_html_file, lesson_name=lesson_name)
    except TemplateNotFound:
        return render_template("lesson_not_found.html")
    
@app.route('/profile')
def profile():
    if current_user.is_authenticated:
        # current_user is an instance of your User class, so you can access its attributes
        user_data = {
            'username': current_user.username,
            'email': current_user.email,
        }
        return render_template('profile.html', user_data=user_data)
    else:
        # Handle the case when the user is not authenticated
        flash('Please log in to access your profile.', 'danger')
        return redirect(url_for('login'))

@login_required
@app.route('/settings')
def settings():
    return render_template('settings.html', username=current_user.username)

@app.route('/submit_feedback', methods=['GET'])
def submit_feedback():
    try:
        feedback_message = request.json.get('feedback_message')
        username = request.json.get('username')
        # Store the feedback_message, date, and time in the database
        feedback_data = {
            'feedback_message': feedback_message,
            'username': username,
            'timestamp': datetime.utcnow()
        }
        feedback_collection.insert_one(feedback_data)
        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"Error submitting feedback: {e}")
        return jsonify({'status': 'error'})

@app.route('/dashboard')
def dashboard():
    # Check if the user is a superuser
    superuser = users_collection.find_one({'username': 'admin'})
    if superuser:
        # Fetch all user data
        all_data = list(users_collection.find())
        # Fetch feedback data
        feedback_data = list(feedback_collection.find())
        return render_template('dashboard.html', all_data=all_data, feedback_data=feedback_data)
    else:
        flash('Access denied. You are not a superuser.', 'danger')
        return redirect(url_for('home'))

if __name__ == '__main__':
    app.run(debug=True)
