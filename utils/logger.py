import datetime

def log(message: str, level: str = "INFO"):
    """
    Simple logger to print messages with a timestamp and log level.
    """
    time_stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    print(f"[{time_stamp}] [{level}] {message}")
