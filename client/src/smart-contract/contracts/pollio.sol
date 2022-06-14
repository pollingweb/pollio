// SPDX-License-Identifier: GPL-3.0

pragma solidity >=0.7.0 <0.9.0;

/**
* @author Soumajit Das
* @title The main contract
* @notice It stores the DB that contains all the Org address and their previous polls
*/
contract PollIO {
    address payable public owner;
    mapping(address => Poll[]) internal db;

    /**
    * @dev Declaring the owner
    */
    constructor() {
        owner = payable(msg.sender);
    }

    /**
    * @notice Org creating a new Poll
    * @param pollName The name of the poll
    * @param pollDuration It counts the average block numbers between the start and end date
    * @param _candidates The array of the candidate IDs
    * @param _pollType The type of the poll (Public/Private)
    * @dev Creates an instance of the poll contract and stores it in the DB
    */ 
    function createPoll (
        string memory pollName,
        uint pollDuration,
        string[] memory _candidates, 
        string memory _pollType
    ) public {
        Poll newPoll = new Poll(msg.sender, pollName, pollDuration, _candidates, _pollType);
        db[msg.sender].push(newPoll);
    }

    /**
    * @notice If the Organization had previous polls, then it returns an array of all polls
    * @notice Else returns an empty array
    */
    function getPreviousPolls() public view returns (Poll[] memory) {
        return db[msg.sender];
    }
}


/**
* @author Soumajit Das
* @title The Poll Contract
* @notice Every time an org creates a new poll, an instance of this contract gets created
*/
contract Poll {
    address payable public org;
    string public pollName;
    uint public startBlock;
    uint public endBlock;

    enum PollType {Public, Private}
    PollType public pollType;

    enum PollState {Started, Running, Canceled, Ended}
    PollState public pollState;

    mapping(address => bool) internal isVoted;
    mapping(string => uint) internal result;

    /**
    * @dev Creates Poll with given data
    * @param eoa The Org account address
    * @param _pollName The name of the poll
    * @param pollDuration It counts the average block numbers between the start and end date
    * @param _candidates The array of the candidate IDs
    * @param _pollType The type of the poll (Public/Private)
    */
    constructor (
        address eoa, 
        string memory _pollName,
        uint pollDuration, 
        string[] memory _candidates, 
        string memory _pollType
    ) {
        org = payable(eoa);
        pollName = _pollName;
        startBlock = block.number;
        endBlock = startBlock + pollDuration;
        pollState = PollState.Running;

        /** 
        * @dev Checking the poll type and then assigning the enum Type
        */ 
        if (keccak256(abi.encodePacked((_pollType))) == keccak256(abi.encodePacked(("Public")))) {
            pollType = PollType.Public;
        } else {
            pollType == PollType.Private;
        }

        /**
        * @dev Storing the IDs of the candidates in result mapping 
        * @dev and setting the vote count to zero(0)
        */
        for (uint i = 0; i < _candidates.length; i++) {
            result[_candidates[i]] = 0;
        }
    }

    /**
    * @dev Checks if the sender is the OWner or not
    */
    modifier onlyOrg {
        require(org == msg.sender, "Only the creater of this poll has this privilege.");
        _;
    }

    /**
    * @dev Checks if the current block number is before the end block number
    */
    modifier beforeEnd {
        require(block.number < endBlock, "The poll already ended.");
        _;
    }

    /**
    * @dev Checks if the current block number is after the start block number
    */
    modifier afterStart {
        require(block.number > startBlock, "The poll has not started yet.");
        _;
    }

    /**
    * @dev Checks if the poll ended or canceled
    */
    modifier ifPollNotEnded {
        require(pollState != PollState.Ended, "The poll already ended.");
        require(pollState != PollState.Canceled, "The poll has been cancelled");
        _;
    }

    /**
    * @dev Checks if the poll type is Public or Private
    */
    modifier dependsOnPollType {
        if (pollType == PollType.Private) {
            require(org == msg.sender, "This is a private poll.");
            _;
        } else {
            _;
        }
    }

    /** 
    * @notice Only the Org can rename the Poll
    * @param name The new name that the org wants to set for the poll
    */ 
    function renamePoll(string memory name) public onlyOrg {
        pollName = name;
    }

    /** 
    * @notice Only the Org can increase the Poll duration (End Date)
    * @param pollDuration The number of blocks that we want to add with end block to increase the duration
    */ 
    function increasePollDuration(uint pollDuration) public onlyOrg {
        endBlock = endBlock + pollDuration;
    }

    /** 
    * @notice Voters can vote between the start date and the end date
    * @param candidate The ID of the candidate whom the voters want to give their vote
    * @dev The address of the voter gets stored in isVoted mapping
    * @dev The count of the votes of the candidate increases by 1
    */ 
    function voteFor(string memory candidate) public beforeEnd afterStart ifPollNotEnded {
        address voter = msg.sender;
        require(!isVoted[voter], "You have already voted!");

        isVoted[voter] = true;
        result[candidate] += 1;
    }

    function getPollType() public view returns(string memory) {
        if (PollType(0) == pollType) {
            return "Public";
        } else if (PollType(1) == pollType) {
            return "Private";
        }
    }

    /** 
    * @notice Only Org can cancel the poll before the end date
    * @dev Change the pollState to PollState.Canceled
    */
    function cancelPoll() public beforeEnd onlyOrg ifPollNotEnded {
        pollState = PollState.Canceled;
    }

    /** 
    * @notice Only Org can end the poll before the end date
    * @dev Change the pollState to PollState.Ended
    */
    function endPoll() public beforeEnd onlyOrg ifPollNotEnded {
        pollState = PollState.Ended;
    }

    /**
    * @notice If the poll is Public then it returns the result to all
    * @notice Else if the poll is private then only Org can access the result
    * @param candidate The ID of the candidate whose score we want to get
    * @return result[candidate] The count of the votes of the candidate
    */ 
    function getResultOf(
        string memory candidate
    ) public view dependsOnPollType returns(uint) {
        return result[candidate];
    }
}
