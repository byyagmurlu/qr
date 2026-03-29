with open('login_err.txt', 'rb') as f:
    content = f.read()
    print(content.decode('utf-16le', errors='ignore'))
