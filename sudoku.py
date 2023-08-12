import random

N = 9
board = [[0 for _ in range(N)] for _ in range(N)]


def PrintBoard():
    for i in range(N):
        if i % 3 == 0:
            print("-" * 23)
        for j in range(N):
            if j % 3 == 0:
                print("|",end=" ")
            if board[i][j] == 0:
                print(" ",end=" ")
            else:
                print(board[i][j],end=" ")
            if j == N-1:
                print("|",end=" ")
        print()
    print("-" * 23)


def isValid(i,j,num):
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


def solve(i,j):
    if i == N-1 and j == N:
        return True
    if j == N:
        i += 1
        j = 0
    if board[i][j] != 0:
        return solve(i,j+1)
    for num in range(1,10):
        if(isValid(i,j,num)):
            board[i][j] = num
            if(solve(i,j+1)):
                return True
        board[i][j] = 0
    return False

solve(0,0)
PrintBoard()
