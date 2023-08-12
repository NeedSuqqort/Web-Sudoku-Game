import random, copy

N = 9

def PrintBoard(board):
    for i in range(N):
        if i % 3 == 0:
            print("-" * 23)
        for j in range(N):
            if j % 3 == 0:
                print("|",end=" ")
            if board[i][j] == 0:
                print("_",end=" ")
            else:
                print(board[i][j],end=" ")
            if j == N-1:
                print("|",end=" ")
        print()
    print("-" * 23)
    print()


def isValid(board,i,j,num):
    block_x = i - i % 3
    block_y = j - j % 3

    for r in range(3):
        for c in range(3):
            if board[block_x+r][block_y+c] == num:
                return False
            
    for r in range(N):
        if board[r][j] == num:
            return False
    
    for c in range(N):
        if board[i][c] == num:
            return False
    
    return True


def solve(board,i,j):
    if i == N-1 and j == N:
        return True
    if j == N:
        i += 1
        j = 0
    if board[i][j] != 0:
        return solve(board,i,j+1)
    for num in range(1,10):
        if(isValid(board,i,j,num)):
            board[i][j] = num
            if(solve(board,i,j+1)):
                return True
        board[i][j] = 0
    return False

def verifypos(initpos,i,j):
    i = int(i); j = int(j)
    if(i < 0 or i >= N or j < 0 or j >= N):
        print("Invalid position.")
        return False
    elif (i,j) in initpos:
        print("You cannot change the value of an initialized tile.")
        return False
    else:
        return True

def generate_board():
    board = [[0 for _ in range(N)] for _ in range(N)]
    for x,y in [(0,0),(3,3),(6,6)]:
        nums = [i for i in range(1,10)]
        for i in range(3):
            for j in range(3):
                board[x+i][y+j] = random.choice(nums)
                nums.remove(board[x+i][y+j])
    
    solve(board,0,0)

    n = random.randint(55,60)
    r = random.randint(0,N-1); c = random.randint(0,N-1)
    for _ in range(n):
        while board[r][c] == 0:
            r = random.randint(0,N-1); c = random.randint(0,N-1)
        board[r][c] = 0
    
    fixedpos = set()

    for r in range(N):
        for c in range(N):
            if board[r][c] != 0:
                fixedpos.add((r,c))

    
    return (board,fixedpos)

def isFinished(board):
    numbers = set()

    for i in range(N):
        for j in range(N):
            if board[i][j] == 0:
                return False
            elif board[i][j] in numbers:
                return False
            else:
                numbers.add(board[i][j])
        numbers.clear()

    for i in range(N):
        for j in range(N):
            if board[j][i] == 0:
                return False
            elif board[j][i] in numbers:
                return False
            else:
                numbers.add(board[j][i])
        numbers.clear()
    
    for i in range(0,9,3):
        for j in range(0,9,3):
            for r in range(3):
                for c in range(3):
                    if board[i+r][j+c] == 0:
                        return False
                    elif board[i+r][j+c] in numbers:
                        return False
                    else:
                        numbers.add(board[i+r][j+c])
            numbers.clear()
    
    return True


def main():
    while True:
        board, initpos = generate_board()
        PrintBoard(board)
        while(not isFinished(board)):
            x, y = input("Enter a position (x,y): ").split()

            while(verifypos(initpos,x,y)==False):
                x, y = input("Please re-enter a valid position (x,y): ").split()
            
            number = int(input("Please enter the number [1-9] you wish to put: "))

            while(number < 1 or number > N):
                number = int(input("Invalid number. Please re-enter a number in range [1-9]."))
            
            board[int(x)][int(y)] = number
            PrintBoard(board)
        
        print("Congratulations! You have solved the sudoku.")
        
        replay = input("Continue to play? (Y/N)")
        while(replay.lower() not in ['y','n']):
            replay = input("Continue to play? (Y/N)")
        if replay.lower() == 'n':
            break

main()
